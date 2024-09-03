export const checkEnvVars = (requiredEnvVars: string[]): void => {
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      throw new Error(
        `La variable d'environnement ${varName} n'est pas définie.`
      );
    }
  }
};
