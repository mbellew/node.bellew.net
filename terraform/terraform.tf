# http://blog.kaliloudiaby.com/index.php/terraform-to-provision-vpc-on-aws-amazon-web-services/
# https://icicimov.github.io/blog/devops/Building-VPC-with-Terraform-in-Amazon-AWS/


# STATE
terraform {
  required_version = ">= 0.9.2"
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


## VPC

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
  vpc_security_group_ids = ["${aws_security_group.appserver_sg.id}"]

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get -y update",
      "sudo apt-get -y install git nodejs npm",
      "sudo npm install -g webpack",
      "git clone https://github.com/mbellew/node.bellew.net.git",
      "cd node.bellew.net",
      "source ./configure/ami_install"
    ]
  }

  tags {
    VPC  = "bellew-vpc"
  }
}


resource "aws_eip" "static_ip"
{
  vpc         = true
  instance    = "${aws_instance.appserver_ec2.id}"
}
