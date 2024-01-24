node {
  stage('SCM') {
    checkout scm
  }
  stage('SonarQube Analysis') {
    withSonarQubeEnv() {
      //def sonarRunner = tool name: 'SonarTest', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
      bat "echo %SONAR_HOST_URL%"
      bat "D:\\sonarqube-10.3\\sonar-scanner-cli-5.0.1.3006-windows\\bin\\sonar-scanner.bat"
    }
  }
}
