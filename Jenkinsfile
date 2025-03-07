pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                // Or if using yarn
                // bat 'yarn install'
            }
        }
        
        stage('Lint') {
            steps {
                bat 'npm run lint'
                // Or if using yarn
                // bat 'yarn lint'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t horizon:latest .'
            }
        }
        
        stage('Local Deployment') {
            steps {
                bat 'docker run -d -p 3000:3000 --name horizon-container horizon:latest'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs for details.'
            // Clean up any running containers if needed
            bat 'docker stop horizon-container || true'
            bat 'docker rm horizon-container || true'
        }
        always {
            // Clean up resources if needed
            bat 'docker ps -a'
        }
    }
}