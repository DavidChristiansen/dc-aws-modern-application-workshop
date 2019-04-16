#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/cdk');
import { Module1Stack } from "../lib/Module1Stack";
import ip = require('what-is-my-ip-address');

const app = new cdk.App();
ip.v4()
  .then((ip) => {
    new Module1Stack(app, 'MythicalMysfits-Module1', ip);
  })

