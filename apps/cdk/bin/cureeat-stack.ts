#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CureeatStack } from '../lib/cureeat-stack';

const app = new cdk.App();
new CureeatStack(app, 'CureeatStack', {
    env: {
        account: "445044180652",
        region: "us-west-1",
    }
});
