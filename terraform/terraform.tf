# http://blog.kaliloudiaby.com/index.php/terraform-to-provision-vpc-on-aws-amazon-web-services/
# https://icicimov.github.io/blog/devops/Building-VPC-with-Terraform-in-Amazon-AWS/


# STATE
terraform {
  required_version = ">= 0.11.1"
  backend "s3" {
    bucket = "secret.bellew.net"
    key = "terraform/www-bellew-net/terraform.tfstate"
    region = "us-west-2"
  }
}


# ENVIRONMENT

variable "azs" {
  type = "map"
  default = {
    "ap-southeast-2" = "ap-southeast-2a,ap-southeast-2b,ap-southeast-2c"
    "eu-west-1"      = "eu-west-1a,eu-west-1b,eu-west-1c"
    "us-west-1"      = "us-west-1b,us-west-1c"
    "us-west-2"      = "us-west-2a,us-west-2b,us-west-2c"
    "us-east-1"      = "us-east-1c,us-west-1d,us-west-1e"
  }
}

##
## VPC
##

resource "aws_vpc" "vpc"
{
  cidr_block           = "10.4.0.0/16"
  enable_dns_hostnames = true
  tags
  {
    Name = "bellew-vpc"
    VPC  = "bellew-vpc"
  }
}


## GATEWAY

resource "aws_internet_gateway" "gw"
{
  vpc_id = "${aws_vpc.vpc.id}"
  tags
  {
    VPC  = "bellew-vpc"
  }
}


resource "aws_subnet" "public_subnet"
{
  availability_zone       = "${element(split(",", lookup(var.azs, var.region)), 0)}"
  vpc_id                  = "${aws_vpc.vpc.id}"
  cidr_block              = "${cidrsubnet(aws_vpc.vpc.cidr_block,8,0)}"
  map_public_ip_on_launch = true
  depends_on = ["aws_internet_gateway.gw"]

  tags {
    VPC  = "bellew-vpc"
  }
}

resource "aws_subnet" "public_alternate_subnet" {
  availability_zone       = "${element(split(",", lookup(var.azs, var.region)), 1)}"
  vpc_id                  = "${aws_vpc.vpc.id}"
  cidr_block              = "${cidrsubnet(aws_vpc.vpc.cidr_block,8,1)}"
  map_public_ip_on_launch = true
  depends_on = ["aws_internet_gateway.gw"]

  tags {
    VPC  = "bellew-vpc"
  }
}

resource "aws_route_table" "public_rtb"
{
  vpc_id = "${aws_vpc.vpc.id}"

  tags {
    VPC  = "bellew-vpc"
  }
}

resource "aws_route" "igw_all_route"
{
  route_table_id = "${aws_route_table.public_rtb.id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = "${aws_internet_gateway.gw.id}"
}


resource "aws_main_route_table_association" "vpc_rt"
{
  vpc_id         = "${aws_vpc.vpc.id}"
  route_table_id = "${aws_route_table.public_rtb.id}"
}

resource "aws_route_table_association" "public_gw_rta"
{
  subnet_id      = "${aws_subnet.public_subnet.id}"
  route_table_id = "${aws_route_table.public_rtb.id}"
}

resource "aws_route_table_association" "public_alternate_gw_rta"
{
  subnet_id      = "${aws_subnet.public_alternate_subnet.id}"
  route_table_id = "${aws_route_table.public_rtb.id}"
}


##
## ALB
##

resource "aws_security_group" "internet_access"
{
  vpc_id = "${aws_vpc.vpc.id}"

  name        = "allow_all_sg"
  description = "Allow all inbound traffic"
}
resource "aws_security_group_rule" "internet_access_tcp_ingress"
{
  type            = "ingress"
  from_port       = 0
  to_port         = 65535
  protocol        = "tcp"
  cidr_blocks     = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.internet_access.id}"
}

resource "aws_security_group" "alb_sg"
{
  vpc_id = "${aws_vpc.vpc.id}"
  name = "alb_sg"
  description = "security group for elb"
}
resource "aws_security_group_rule" "alb_http_all"
{
  type            = "ingress"
  from_port       = 80
  to_port         = 80
  protocol        = "tcp"
  cidr_blocks     = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.alb_sg.id}"
}
resource "aws_security_group_rule" "alb_http8080_all"
{
  type            = "ingress"
  from_port       = 8080
  to_port         = 8080
  protocol        = "tcp"
  cidr_blocks     = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.alb_sg.id}"
}
resource "aws_security_group_rule" "alb_https_all"
{
  type            = "ingress"
  from_port       = 443
  to_port         = 443
  protocol        = "tcp"
  cidr_blocks     = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.alb_sg.id}"
}
resource "aws_security_group_rule" "alb_allow_egress"
{
  type            = "egress"
  from_port       = 0
  to_port         = 65335
  protocol        = "tcp"
  cidr_blocks     = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.alb_sg.id}"
}


resource "aws_alb" "vpc_alb"
{
  name            = "alb-bellew-net"
  internal        = false
  subnets         = ["${aws_subnet.public_subnet.id}", "${aws_subnet.public_alternate_subnet.id}"]
  security_groups = [
    "${aws_security_group.internet_access.id}",
    "${aws_security_group.alb_sg.id}"
  ]

  tags {
    VPC  = "bellew-vpc"
  }
}

resource "aws_alb_target_group" "default"
{
  name     = "default-tg"
  port     = "8080"
  protocol = "HTTP"
  vpc_id   = "${aws_vpc.vpc.id}"

  health_check
  {
    protocol = "HTTP"
    healthy_threshold   = 2
    interval            = 15
    path                = "/"
    matcher             = "200"
    timeout             = 5
    unhealthy_threshold = 5
  }

  tags
  {
    VPC  = "bellew-vpc"
  }
}

resource "aws_alb_listener" "alb_http_listener"
{
  load_balancer_arn = "${aws_alb.vpc_alb.arn}"
  port              = "80"
  protocol          = "HTTP"

  default_action
  {
    target_group_arn = "${aws_alb_target_group.default.arn}"
    type             = "forward"
  }
}


##
## EC2 INSTANCES
##


data "aws_ami" "ubuntu"
{
  most_recent = true

  filter
  {
    name   = "name"
    # values = ["ubuntu/images/hvm-ssd/ubuntu-trusty-14.04-amd64-server-*"]
    # values = ["ubuntu/images/hvm-ssd/ubuntu-xenial-16.04-amd64-server-*"]
    values = ["ubuntu/images/hvm-ssd/ubuntu-artful-17.10-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}


resource "aws_security_group" "appserver_sg" {
  name = "allow ssh http https"
  description = "Allow connections to chefserver"
  vpc_id = "${aws_vpc.vpc.id}"

  tags {
    VPC  = "bellew-vpc"
  }
}

resource "aws_security_group_rule" "allow_ssh_inbound" {
  type = "ingress"
  security_group_id = "${aws_security_group.appserver_sg.id}"
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "allow_http_inbound" {
  type = "ingress"
  security_group_id = "${aws_security_group.appserver_sg.id}"
  from_port   = 80
  to_port     = 80
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "allow_http8080_inbound" {
  type = "ingress"
  security_group_id = "${aws_security_group.appserver_sg.id}"
  from_port   = 8080
  to_port     = 8080
  protocol    = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "allow_all_outbound" {
  type = "egress"
  security_group_id = "${aws_security_group.appserver_sg.id}"
  from_port   = 0
  to_port     = 0
  protocol    = "-1"
  cidr_blocks = ["0.0.0.0/0"]
}


resource "aws_instance" "appserver_ec2"
{
  availability_zone = "${aws_subnet.public_subnet.availability_zone}"
  ami           = "${data.aws_ami.ubuntu.id}"
  instance_type = "t2.small"
  key_name = "${var.key_name}"
  subnet_id  = "${aws_subnet.public_subnet.id}"
  vpc_security_group_ids = ["${aws_security_group.appserver_sg.id}", "${aws_security_group.alb_sg.id}"]

  provisioner "remote-exec"
  {
    inline = [
      "sudo apt-get -y install git",
      "git clone https://github.com/mbellew/node.bellew.net.git",
      "cd node.bellew.net",
      "chmod +x ./configure/ami_install",
      "./configure/ami_install"
    ]
    connection
    {
      type = "ssh"
      user = "ubuntu"
      private_key = "${file("${var.key_name}.pem")}"
    }
  }

  tags {
    VPC  = "bellew-vpc"
  }
}

resource "aws_alb_target_group_attachment" "tg_attachment"
{
  target_group_arn = "${aws_alb_target_group.default.arn}"
  target_id        = "${aws_instance.appserver_ec2.id}"
  port             = "8080"
}

resource "aws_eip" "static_ip"
{
  vpc         = true
  instance    = "${aws_instance.appserver_ec2.id}"
}
