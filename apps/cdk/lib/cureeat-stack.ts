import { Aws, Duration, Stack, StackProps, Tags } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as codedeploy from "aws-cdk-lib/aws-codedeploy";
import { Construct } from "constructs";

const GITHUB_REPO_NAME = "parkernilson/cure-eat-2"

export class CureeatStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "CureeatVPC", {
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/24"),
      availabilityZones: ["us-west-1a"],
      subnetConfiguration: [
        {
          name: "application",
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const webappDeploymentBucket = new s3.Bucket(this, "CureeatDeployBucket", {
      bucketName: "cureeat-deploy-bucket",
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const webappRole = new iam.Role(this, "WebappRole", {
      path: "/",
      roleName: "WebappRole",
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("ec2.amazonaws.com"),
        new iam.ServicePrincipal("codedeploy.amazonaws.com")
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
      ],
      inlinePolicies: {
        "allow-webapp-deployment-bucket-policy": new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                "s3:getObject"
              ],
              resources: [webappDeploymentBucket.bucketArn + "/*"],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                "s3:ListBucket"
              ],
              resources: [webappDeploymentBucket.bucketArn],
            })
          ],
        })
      }
    })

    const ec2Instance = new ec2.Instance(this, "CureeatEC2", {
      vpc: vpc,
      keyName: "parker-dev-keypair",
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      // machineImage: ec2.MachineImage.latestAmazonLinux2023()
      machineImage: ec2.MachineImage.lookup({
        name: "AmazonLinux2023-Node-PM2-Caddy",
      }),
      role: webappRole
    });
    Tags.of(ec2Instance).add("codedeploy-project", "cureeat")

    const oidcProvider = new iam.OpenIdConnectProvider(this, "GithubOidcProvider", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
    });

    const githubIamRole = new iam.Role(this, "GithubIamRole", {
      path: "/",
      roleName: "CodeDeployRoleForGithub",
      assumedBy: new iam.OpenIdConnectPrincipal(oidcProvider, {
        "StringLike": {
          "token.actions.githubusercontent.com:sub": `repo:${GITHUB_REPO_NAME}:*`
        }
      }),
      maxSessionDuration: Duration.hours(12),
      description: "IAM role for CodeDeploy to access Github",
    });

    githubIamRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "codedeploy:Get*",
        "codedeploy:Batch*",
        "codedeploy:CreateDeployment",
        "codedeploy:RegisterApplicationRevision",
        "codedeploy:List*"
      ],
      resources: [`arn:${Aws.PARTITION}:codedeploy:*:${Aws.ACCOUNT_ID}:*`]
    }))

    githubIamRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "s3:GetObject",
        "s3:PutObject",
      ],
      resources: [webappDeploymentBucket.bucketArn + "/*"],
    })) 

    githubIamRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "s3:ListBucket",
      ],
      resources: [webappDeploymentBucket.bucketArn],
    }))

    const cureeatApplication = new codedeploy.ServerApplication(this, "CureeatApplication", {
      applicationName: "CureeatApplication",
    })

    const cureeatSecurityGroup = new ec2.SecurityGroup(this, "CureeatSecurityGroup", {
      vpc: vpc,
      allowAllOutbound: true,
      securityGroupName: "CureeatSecurityGroup",
    })
    cureeatSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), "allow http access from anywhere")
    cureeatSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), "allow https access from anywhere")
    cureeatSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "allow https access from anywhere")

    const codeDeployRole = new iam.Role(this, "CodeDeployRole", {
      assumedBy: new iam.ServicePrincipal("codedeploy.amazonaws.com"),
      path: "/",
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSCodeDeployRole"),
      ]
    });

    codeDeployRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "ec2:RunInstances",
        "ec2:CreateTags",
        "iam:PassRole",
      ],
      resources: [`arn:${Aws.PARTITION}:codedeploy:*:${Aws.ACCOUNT_ID}:*`]
    }))

    const webappDeploymentGroup = new codedeploy.ServerDeploymentGroup(this, "CureeatDeploymentGroup", {
      application: cureeatApplication,
      role: codeDeployRole,
      deploymentGroupName: "CureeatDeploymentGroup",
      deploymentConfig: codedeploy.ServerDeploymentConfig.ALL_AT_ONCE,
      autoRollback: {
        failedDeployment: true,
        stoppedDeployment: true,
      },
      ec2InstanceTags: new codedeploy.InstanceTagSet({ "codedeploy-project": ["cureeat"] }),
    })

    const webappInstanceProfile = new iam.InstanceProfile(this, "CureeatInstanceProfile", {
      role: webappRole,
    })
    
  }
}
