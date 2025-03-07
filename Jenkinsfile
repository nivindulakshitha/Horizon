pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "horizon-app"
        DOCKER_TAG = "${env.BUILD_NUMBER ?: 'dev'}"
        DOCKER_FULL_IMAGE = "${DOCKER_IMAGE}:${DOCKER_TAG}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_FULL_IMAGE} ."
                }
            }
        }
        
        stage('Local Deployment') {
            steps {
                script {
                    // Stop any existing container
                    sh "docker stop horizon-local || true"
                    sh "docker rm horizon-local || true"
                    
                    // Run the container locally
                    sh """
                        docker run -d --name horizon-local \\
                            -p 3000:3000 \\
                            --env-file .env.local \\
                            ${DOCKER_FULL_IMAGE}
                    """
                    
                    echo "Application deployed locally at http://localhost:3000"
                }
            }
        }
    }
    
    post {
        failure {
            echo 'Pipeline failed. Please check the logs for details.'
        }
    }
}