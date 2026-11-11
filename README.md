# ☢ Nuclear Sentinel — AMAZUL (Sprint 1 · MVP)

Integrantes:
Pedro César de Camargo Branco - RM567971
Renan Rodrigues de Matos Almeida-RM567952
Thiago Garcia Batista Santos - RM568107
Henry de Oliveira Vasconcellos - RM566836
Nicolly Giroto Baptista - RM568204

Aplicativo mobile para **registro, consulta e classificação de ocorrências simuladas** em uma instalação nuclear fictícia.

## Descrição da solução
O operador faz login, registra ocorrências (radiação, temperatura, pressão ou vazamento) informando o valor medido, e o app classifica automaticamente o alerta como **Normal**, **Atípico** ou **Crítico**. As ocorrências podem ser filtradas por nível de alerta e consultadas em detalhes. O **supervisor** também pode alterar o status da ocorrência (Aberta → Em análise → Resolvida).

## Tecnologias
- React Native + Expo (SDK 58)
- TypeScript (modo `strict`)
- React Navigation (native stack)
- AsyncStorage (sessão e ocorrências)
- Context API (autenticação)

## Estrutura
```
src/
  components/   AlertBadge, FormField, OccurrenceCard
  context/      AuthContext (sessão + papéis)
  data/         catálogo inicial (usuários e ocorrências)
  navigation/   AppNavigator (stack condicionada à sessão)
  screens/      Login, Lista, Cadastro, Detalhes
  services/     authService, occurrenceService, alertClassifier, storage
  types/        User, UserRole, Occurrence, AlertLevel, OccurrenceStatus...
  utils/        labels
```

## Como executar
```bash
npm install
npx expo install --fix   # alinha versões das dependências ao SDK
npx expo start
```
Abra no celular com o app **Expo Go** (QR Code) ou pressione `a` (Android) / `i` (iOS) / `w` (web).

## Contas de teste
| Perfil     | E-mail                 | Senha  |
|------------|------------------------|--------|
| Operador   | operador@amazul.com    | 123456 |
| Supervisor | supervisor@amazul.com  | 123456 |

## Regras de classificação
| Categoria   | Normal  | Atípico        | Crítico  |
|-------------|---------|----------------|----------|
| Radiação (µSv/h) | < 0,5 | 0,5 a < 2   | ≥ 2      |
| Temperatura (°C) | < 300 | 300 a < 330 | ≥ 330    |
| Pressão (bar)    | < 155 | 155 a < 170 | ≥ 170    |
| Vazamento (L/min)| < 1   | 1 a < 10    | ≥ 10     |

## Perfis e controle de acesso
- **Operador:** registra e consulta ocorrências.
- **Supervisor:** tudo do operador + altera o status das ocorrências.
- A função `hasRole()` do `AuthContext` centraliza as checagens, facilitando evoluir o controle de acesso.

## Persistência
Na primeira execução o catálogo inicial é gravado no AsyncStorage. Novas ocorrências e a sessão do usuário permanecem salvas localmente.

## Próximos passos
Backend real, autenticação segura, edição/exclusão, notificações para alertas críticos, relatórios.
