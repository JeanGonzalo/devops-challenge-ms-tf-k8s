import hudson.model.*
import hudson.EnvVars
import groovy.json.JsonSlurperClassic
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import java.net.URL
import java.net.URLEncoder

@NonCPS
def jsonParse(def json) {
    new groovy.json.JsonSlurperClassic().parseText(json)
}

pipeline {

    agent {
        label getLabel()
    }

    options {
        office365ConnectorWebhooks([[
                    startNotification: true,
                    notifySuccess: true,
                    notifyUnstable: true,
                    notifyFailure: true,
                    timeout: 30000,
                    url: 'https://corpbiz.webhook.office.com/webhookb2/9de46f89-dd64-4c8d-be07-2f262bb69573@e1fd30ac-0226-49d7-9516-edd8d1e0b18d/JenkinsCI/426d1c7462614e4abf79cb8a4f04a283/175e7b0b-0e33-46f7-ab78-8784030afe60'
            ]]
        )
    }
    environment {
        IMAGE_NAME_API_GATEWAY = 'jeancarlodevops/app_emails'
        IMAGE_NAME_USERS = 'jeancarlodevops/microservice-users'
        IMAGE_NAME_EMAILS = 'jeancarlodevops/microservice-emails'
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT = '5476829531284'
        IMAGE_TAG = getShortCommitId()
        ENVIRONMENT = getEnvironment()
        SONAR_SCANNER_VERSION = '3.3.0'
        AWS_CLI_VERSION = '1.16'
        SHORT_COMMIT = getShortCommitId()
    }
  parameters {
      string(name: 'DEPLOY_TO', defaultValue: '', description: '')
  }
    stages {

        stage("SonarQube - Static Code Analysis") {
            // when {
            //     expression { !enableDeploy() }
            // }
            steps {
                script {
                    def projectVersion = getShortCommitId()
                    def pullRequestParams = ""

                    docker.image('sonarsource/sonar-scanner-cli:4.4').inside('-u 0') {
                      withSonarQubeEnv('Sonar Qube Server') {

                        sh  " sonar-scanner -X -Dsonar.host.url=\$SONAR_HOST_URL \
                              -Dsonar.login=\$SONAR_AUTH_TOKEN \
                              -Dsonar.projectKey='app-send-emails' \
                              -Dsonar.projectName='App-Send Emails' \
                              -Dsonar.projectVersion='${projectVersion}' ${pullRequestParams} \
                            "
                      }
                    }
                }
            }
        }

        stage ('Create Image') {
        
            steps {
                script {
                // Build API GATEWAY
                dir('api-gateway'){
                    def imageTag = "${ENVIRONMENT}-${IMAGE_TAG}"
                    def imageName = "${IMAGE_NAME_API_GATEWAY}:${imageTag}"
                    def repositoryName = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${imageName}"
                    sh "docker build -t ${imageName} ."
                    sh "docker tag ${imageName} ${repositoryName}"
                }
                // Build EMAILS
                dir('microservices-emails'){
                    def imageTag = "${ENVIRONMENT}-${IMAGE_TAG}"
                    def imageName = "${IMAGE_NAME_EMAILS}:${imageTag}"
                    def repositoryName = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${imageName}"
                    sh "docker build -t ${imageName} ."
                    sh "docker tag ${imageName} ${repositoryName}"
                }
                // Build USERS
                dir('microservices-users'){
                    def imageTag = "${ENVIRONMENT}-${IMAGE_TAG}"
                    def imageName = "${IMAGE_NAME_USERS}:${imageTag}"
                    def repositoryName = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${imageName}"
                    sh "docker build -t ${imageName} ."
                    sh "docker tag ${imageName} ${repositoryName}"
                }

                }

            }
        }

        stage ('Push Image') {
      
            steps {
                //Pushing Api Gateway
                script {
                    def imageTag = "${ENVIRONMENT}-${IMAGE_TAG}"
                    def imageName = "${IMAGE_NAME_API_GATEWAY}:${imageTag}"
                    def repositoryName = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${imageName}"
                    sh "\$(aws ecr get-login --no-include-email --registry-ids ${AWS_ACCOUNT} --region ${AWS_REGION})"
                    sh "docker push ${repositoryName}"
                    
                }
                //Pushing Emails
                script {
                    def imageTag = "${ENVIRONMENT}-${IMAGE_TAG}"
                    def imageName = "${IMAGE_NAME_EMAILS}:${imageTag}"
                    def repositoryName = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${imageName}"
                    sh "\$(aws ecr get-login --no-include-email --registry-ids ${AWS_ACCOUNT} --region ${AWS_REGION})"
                    sh "docker push ${repositoryName}"
                    
                }

                //Pushing Users
                script {
                    def imageTag = "${ENVIRONMENT}-${IMAGE_TAG}"
                    def imageName = "${IMAGE_NAME_USERS}:${imageTag}"
                    def repositoryName = "${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${imageName}"
                    sh "\$(aws ecr get-login --no-include-email --registry-ids ${AWS_ACCOUNT} --region ${AWS_REGION})"
                    sh "docker push ${repositoryName}"
                    
                }
            }
        } 

        stage ('Update Pods EKS') {
            steps {
                // Update lambda function
                script {    
                    docker.image("amazon/aws-cli:2.4.21").inside("""--entrypoint=''""") {
                        def awsScript =  """
                        #!/bin/bash -xe    
                            aws lambda update-function-code \
                            --function-name arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT}:function:${LAMBDA_NAME}-${ENVIRONMENT} \
                            --image-uri ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_NAME_PREDICTOR}:predict_${ENVIRONMENT} \
                            --region ${AWS_REGION} \
                            --no-cli-pager 
                        """
                        def result = sh(returnStdout: true, script: awsScript, label: "Update lambda Predictor").trim()
                        def json = jsonParse(result)
                        echo "Predictor Object is => ${json}"
                    }
                }

                // Update lambda function
                script {
                    docker.image("amazon/aws-cli:2.4.21").inside("""--entrypoint=''""") {
                        def awsScript =  """
                        #!/bin/bash -xe    
                            aws lambda update-function-code \
                            --function-name arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT}:function:${LAMBDA_BRIDGE}-${ENVIRONMENT} \
                            --image-uri ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com/${IMAGE_NAME_PREDICTOR}:bridge_${ENVIRONMENT} \
                            --region ${AWS_REGION} \
                            --no-cli-pager 
                        """
                        def result = sh(returnStdout: true, script: awsScript, label: "Update lambda Bridge").trim()
                        def json = jsonParse(result)
                        echo "Bridge Object is => ${json}"
                    }                    
                }
            }
        }       
    }

}

def getEnvironment(){
    if(isDevelop())
      return "dev"

    if(isRelease())
      return "qas"

    if(isMaster())
      return "prd"

    return "dev"
}

def isMaster() {
    return env.BRANCH_NAME == "main"
}

def isRelease() {
    return env.BRANCH_NAME ==~ 'qas'
}

def isDevelop() {
    return env.BRANCH_NAME == '^release\\/[\\w\\d\\.]*$'
}

def getShortCommitId() {
    def gitCommit = env.GIT_COMMIT
    def shortGitCommit = "${gitCommit[0..6]}"
    return shortGitCommit
}

def getLabel(){
    def configuration = jenkins.model.Jenkins.instance.getItem(env.JOB_NAME.minus("/${env.JOB_BASE_NAME}"))
    return (configuration.getDescription() != '')?configuration.getDescription():'ec2-linux-spot-slave'
}
def getContainerEnvironment() {
    return (isDevelop())?'stage':(isRelease()?'stage':(isMaster())?'production':'production')
} 
def allowCommonBranches(){
  return isRelease()
}
def enableDeploy() {
  return isMaster() && params.DEPLOY_TO == 'production'
}
