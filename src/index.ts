import { S3BucketWithContentsOptions } from './S3BucketWithContentsOptions';
import {
  createCloudFormationCustomResource,
  CloudFormationCustomResourceProperties,
} from '@sjmeverett/cloudformation-types';
import { createLambdaFnWithRole } from '@sjmeverett/cloudformation-lambda';

export interface CreateS3BucketWithContentsOptions
  extends S3BucketWithContentsOptions,
    CloudFormationCustomResourceProperties {}

export function createS3BucketWithContents(
  name: string,
  options: CreateS3BucketWithContentsOptions,
) {
  return createCloudFormationCustomResource(name, options);
}

export function createS3BucketWithContentsResources(
  bucket: string,
  key: string,
  allowedBuckets?: string[],
) {
  return createLambdaFnWithRole('S3BucketWithContentsResource', {
    Code: {
      S3Bucket: bucket,
      S3Key: key,
    },
    Handler: 'index.handler',
    Runtime: 'nodejs12.x',
    Timeout: 120,
    AllowLogging: true,
    Policies: [
      {
        PolicyName: 'S3BucketWithContentsResourceS3Policy',
        PolicyDocument: {
          Statement: [
            {
              Action: ['s3:*'],
              Effect: 'Allow',
              Sid: 'AddPerm',
              Resource: allowedBuckets || '*',
            },
          ],
        },
      },
    ],
  });
}
