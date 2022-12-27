# Sets global variables for this Terraform project.

variable app_name {
    default = "flixtube"
}
variable location {
  default = "West US"
}

variable location2 {
  default = "West US 2"
}

variable app_version { # Can't be called version! That's a reserved word.
}

variable admin_username {
  default = "linux_admin"
}

variable client_id {

}

variable client_secret {

}