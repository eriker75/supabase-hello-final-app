# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Project Documentation

- All project documentation is located in the [`/docs`](./docs) folder.
- Development history, architectural decisions, and task status are tracked in [`docs/devlog.md`](./docs/devlog.md).
- For details on specific tasks, see the task files in `/docs`.

## Backend Structure

- Infrastructure datasources in `src/infraestructure/datasources/` are implemented as classes (e.g., `ChatDatasourceImpl`, `UserProfileDatasourceImpl`), with all data operations as class methods.
- This structure improves maintainability and prepares for future decoupling between domain and infrastructure layers.
- **ChatRepositoryImpl** in `src/infraestructure/repositories/` is now implemented as a set of exported [React Query](https://tanstack.com/query/latest) hooks, not a class. All chat data access is performed via hooks (see [`docs/2025-08-12-react-query-chat-repository.md`](./docs/2025-08-12-react-query-chat-repository.md) for details).
- **OnboardingRepositoryImpl** y **InteractionRepositoryImpl** en `src/infraestructure/repositories/` siguen el mismo patrón de hooks React Query, usando instancias singleton de sus datasources y exponiendo hooks para las operaciones principales de onboarding e interacción (ver [`docs/2025-08-14-add-onboarding-interaction-repositories.md`](./docs/2025-08-14-add-onboarding-interaction-repositories.md)).
- Other repositories (e.g., `UserProfileRepositoryImpl`, `UserLocationRepositoryImpl`) remain class-based and conform to their respective domain interfaces.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
