import cdk = require('@aws-cdk/cdk');
import s3 = require('@aws-cdk/aws-s3');
import iam = require('@aws-cdk/aws-iam');
import s3deploy = require('@aws-cdk/aws-s3-deployment');
import path = require('path');
import { hashDirectorySync } from './hash';
export class Module1Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, allowedIPAddress: string) {
    super(scope, id);
    const projectName = "mythical-mysfits";
    const bucket = new s3.Bucket(this, 'Bucket', {
      bucketName: projectName + "-frontend-" + cdk.Aws.accountId,
      websiteErrorDocument: 'error.html',
      websiteIndexDocument: 'index.html',
    });
    const bucketPolicy = new iam.PolicyStatement()
    bucketPolicy.addAnyPrincipal();
    bucketPolicy.addAction("s3:*");
    bucketPolicy.addResource(bucket.bucketArn + "/*");
    bucketPolicy.addCondition("IpAddress", {
      "aws:SourceIp": allowedIPAddress + '/32' // Restrict to the current IP address
    });
    bucketPolicy.allow();
    bucket.addToResourcePolicy(bucketPolicy);

    const contentDir = path.join(__dirname, '../../', 'frontend', 'dist');
    const contentHash = hashDirectorySync(contentDir);
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      source: s3deploy.Source.asset(contentDir),
      destinationBucket: bucket,
      destinationKeyPrefix: contentHash,
      retainOnDelete: true
    });
  }
}
