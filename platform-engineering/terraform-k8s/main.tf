# Otomasi provisioning multi-cloud. Bahasa: HCL (Terraform).
terraform {
  required_version = ">= 1.7"
}

variable "regions" {
  type    = list(string)
  default = ["asia-southeast2", "asia-southeast1"]
}

resource "null_resource" "cluster_per_region" {
  count = length(var.regions)
}
