pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Environment') {
    steps {
        withCredentials([file(credentialsId: 'app-env-file', variable: 'ENV_FILE')]) {
            bat 'cp $ENV_FILE .env'
        }
    }
}
        
        stage('Setup Environment') {
            steps {
                // Create .env file for local development
                // This file is created during build time and not committed to GitHub
                bat '''
                    (
                        echo DWOLLA_ENVIRONMENT=sandbox
                        echo NODE_ENV=production
                        echo PORT=3000
                        REM Add other environment variables as needed
                    ) > .env
                '''
                
                // Show the .env file for debugging (remove in production)
                bat 'type .env'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        
        stage('Lint') {
            steps {
                bat 'npm run lint'
            }
        }
        
        stage('Clean Existing Containers') {
            steps {
                bat 'cmd /c "docker stop horizon-container 2>nul || echo No container to stop"'
                bat 'cmd /c "docker rm horizon-container 2>nul || echo No container to remove"'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                // Build the Docker image with the .env file
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
            bat 'cmd /c "docker stop horizon-container 2>nul || echo No container to stop"'
            bat 'cmd /c "docker rm horizon-container 2>nul || echo No container to remove"'
        }
        always {
            bat 'docker ps -a'
            // Clean up the .env file after build to avoid leaving credentials
            bat 'del .env'
        }
    }
}