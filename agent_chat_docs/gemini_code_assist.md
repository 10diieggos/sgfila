| **Note:** If you're at a business or would like more team-level benefits, consider[Gemini Code Assist Standard or Enterprise](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise).

Gemini Code Assist offers AI-powered assistance to help your development team build, deploy, and operate applications throughout the software development lifecycle. Gemini Code Assist is available in the following editions:

- [Gemini Code Assist for individuals](https://developers.google.com/gemini-code-assist/docs/overview#supported-features-gca), available at no cost.

- [Gemini Code Assist Standard](https://developers.google.com/gemini-code-assist/docs/overview#supported-features), a product in the[Gemini for Google Cloud](https://cloud.google.com/gemini/docs/overview)portfolio.

- [Gemini Code Assist Enterprise](https://developers.google.com/gemini-code-assist/docs/overview#supported-features), a product in the[Gemini for Google Cloud](https://cloud.google.com/gemini/docs/overview)portfolio.

| **Note:** Individual developers using the free version of Gemini Code Assist, Gemini Code Assist for individuals, can get access to higher daily model request limits by purchasing a subscription to Google AI Pro or Ultra. This will enable higher daily model request limits shared across Gemini Code Assist, Gemini CLI and agent mode.[Learn more](https://blog.google/technology/developers/gemini-cli-code-assist-higher-limits).

You can use Gemini Code Assist in[supported IDEs](https://developers.google.com/gemini-code-assist/docs/supported-languages#supported_ides), such as VS Code, JetBrains IDEs, or Android Studio, for AI-powered coding assistance in[many popular languages](https://developers.google.com/gemini-code-assist/docs/supported-languages). You can get code completions as you write your code, generate full functions or code blocks from comments, generate unit tests, and get help with debugging, understanding, and documenting your code.

Gemini Code Assist provides contextualized responses to your prompts, including[source citations](https://developers.google.com/gemini-code-assist/docs/works#how-when-gemini-cites-sources)regarding which documentation and code samples Gemini Code Assist used to generate its responses.

The Gemini large language models (LLMs) that are used by Gemini Code Assist are trained on datasets of publicly available code, Google Cloud-specific material, and other relevant technical information in addition to the datasets used to train the Gemini[foundation models](https://storage.googleapis.com/deepmind-media/gemini/gemini_1_report.pdf). Models are trained so that Gemini Code Assist responses are as useful to Gemini Code Assist users as possible.

- [Learn how and when Gemini Code Assist Standard and Enterprise use your data](https://developers.google.com/gemini-code-assist/docs/data-governance).
- [Learn how and when Gemini Code Assist for individuals uses your data](https://developers.google.com/gemini-code-assist/resources/privacy-notice-gemini-code-assist-individuals).

As an early-stage technology, Gemini Code Assist can generate output that seems plausible but is factually incorrect. We recommend that you validate all output from Gemini Code Assist before you use it. For more information, see[Gemini Code Assist and responsible AI](https://developers.google.com/gemini-code-assist/docs/responsible-ai).

Gemini Code Assist provides citation information when it directly quotes at length from another source, such as existing open source code. For more information, see[How and when Gemini cites sources](https://developers.google.com/gemini-code-assist/docs/works#how-when-gemini-cites-sources).

## Supported features for Gemini Code Assist for individuals

The following table shows the types of generative AI assistance that are available in[supported IDEs](https://developers.google.com/gemini-code-assist/docs/supported-languages#supported_ides)at no cost:

|                                                                                                                                                                                                                                                                                          AI coding assistance                                                                                                                                                                                                                                                                                           |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Code completion and generation in your IDE project in the following IDEs: - [VS Code, JetBrains IDEs (such as IntelliJ and PyCharm)](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#get_code_completions), and[Android Studio](https://developer.android.com/studio/gemini/overview)                                                                                                                                                                                                                                                                                           |
| Conversational assistant in your IDE[using your opened files' context](https://developers.google.com/gemini-code-assist/docs/works#gemini-code-assist)                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Multi-IDE support (VS Code,[JetBrains IDEs such as IntelliJ and PyCharm](https://developers.google.com/gemini-code-assist/docs/supported-languages#supported_ides), and[Android Studio](https://developer.android.com/studio/gemini/overview))                                                                                                                                                                                                                                                                                                                                                          |
| Prompt Gemini to complete complex, multi-step tasks that use system tools and Model Context Protocol (MCP) servers. For more information, see[Use the Gemini Code Assist agent mode](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer).                                                                                                                                                                                                                                                                                                                           |
| [Quota](https://developers.google.com/gemini-code-assist/resources/quotas)for using[Gemini CLI](https://developers.google.com/gemini-code-assist/docs/gemini-cli).                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Initiate smart actions by right-clicking selected code ([VS Code](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#use_smart_actions),[JetBrains IDEs such as IntelliJ and PyCharm](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#use_smart_actions), and[Android Studio](https://developer.android.com/studio/gemini/overview)). Initiate smart commands with the slash`/`on the quick pick bar either with or without selected code ([VS Code](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#generate_code_with_prompts)). |
| [Source citations in your IDE](https://developers.google.com/gemini-code-assist/docs/works)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

## Gemini Code Assist Standard and Enterprise editions overview

The following section compares the Gemini Code Assist Standard and Enterprise editions.

The Standard edition offers AI coding assistance, with enterprise-grade security, for building and running applications. The Enterprise edition offers all of the[supported features](https://developers.google.com/gemini-code-assist/docs/overview#supported-features)in the Standard edition, but you can also customize it based on your private source code repositories, and it's integrated with additional Google Cloud services for building applications across a broader tech stack.

The following table helps you to decide which edition aligns best with your organization's development goals by highlighting the intended audience and the benefits for each edition:

|                   |                                                                                                                                                                                                                                                                                                    Gemini Code Assist Standard                                                                                                                                                                                                                                                                                                    |                                                                                                                                                                                                                                                                                              Gemini Code Assist Enterprise                                                                                                                                                                                                                                                                                               |
| Intended audience |                                                                                                                                                                                                                                                            - Customers with basic coding needs. - Organizations with strict data security and compliance requirements.                                                                                                                                                                                                                                                            |                                                                                                                                   - Large enterprises with complex software development processes. - Customers wanting to have AI response customized based on private source code repositories to accelerate development based on organizational best practices. - Customers needing AI-powered application development assistant across an expanding list of Google Cloud services.                                                                                                                                    |
|     Benefits      | - Code completion and generation for popular programming languages, and available across some Google Cloud services. - AI-powered chat support. - Simplified user interface and integration with IDEs. - Local codebase awareness in your IDE: Use the power of Gemini's large context window for in-depth local codebase understanding. - Enterprise-grade security: Robust data governance, secure infrastructure, and indemnification for code suggestions. - Extended integrations: Gemini Code Assist Standard provides AI assistance in Firebase, Colab Enterprise, BigQuery data insights, Cloud Run, and Database Studio. | - All of the benefits mentioned for Gemini Code Assist Standard, with the addition of the following: - [Code customization](https://developers.google.com/gemini-code-assist/docs/code-customization-overview): Your organization can augment the model with your private codebases for tailored suggestions. - Extended integrations: Gemini Code Assist Enterprise provides AI assistance across Google Cloud like Apigee, Application Integration, and Gemini Cloud Assist, empowering cloud teams to build, design and operate, and optimize their applications and infrastructure more effectively on Google Cloud. |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

For a comparison of each edition's features, see[Supported features](https://developers.google.com/gemini-code-assist/docs/overview#supported-features).

## Supported features for Gemini Code Assist Standard and Enterprise

The following sections show the types of generative AI assistance that are available in Gemini Code Assist Standard and Enterprise.

### Code assistance and chat

The following table shows the types of generative AI assistance that are available in[supported IDEs](https://developers.google.com/gemini-code-assist/docs/supported-languages#supported_ides):

|                                                                                                                                                                                                                                                                                          AI coding assistance                                                                                                                                                                                                                                                                                          | Gemini Code Assist Standard | Gemini Code Assist Enterprise |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|-------------------------------|
| Code completion and generation in your IDE project in the following IDEs: - [VS Code](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#get_code_completions) - [JetBrains IDEs (such as IntelliJ and PyCharm)](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#get_code_completions) - [Android Studio](https://developer.android.com/studio/gemini/overview)                                                                                                                                                                                           |                             |                               |
| Conversational assistant in your IDE[using your opened files' context](https://developers.google.com/gemini-code-assist/docs/works#gemini-code-assist)                                                                                                                                                                                                                                                                                                                                                                                                                                                 |                             |                               |
| Multi-IDE support (VS Code,[JetBrains IDEs such as IntelliJ and PyCharm](https://developers.google.com/gemini-code-assist/docs/supported-languages#supported_ides), and[Android Studio](https://developer.android.com/studio/gemini/overview))                                                                                                                                                                                                                                                                                                                                                         |                             |                               |
| Prompt Gemini to complete complex, multi-step tasks that use system tools and Model Context Protocol (MCP) servers. For more information, see[Use the Gemini Code Assist agent mode](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer).                                                                                                                                                                                                                                                                                                                          |                             |                               |
| [Quota](https://developers.google.com/gemini-code-assist/resources/quotas)for using[Gemini](https://developers.google.com/gemini-code-assist/docs/gemini-cli)CLI.                                                                                                                                                                                                                                                                                                                                                                                                                                      |                             |                               |
| Initiate smart actions by right-clicking selected code ([VS Code](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#use_smart_actions),[JetBrains IDEs such as IntelliJ and PyCharm](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#use_smart_actions), and[Android Studio](https://developer.android.com/studio/gemini/overview)). Initiate smart commands with the slash`/`on the quick pick bar either with or without selected code ([VS Code](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#generate_code_with_prompts). |                             |                               |
| [Source citations in your IDE and the Google Cloud console](https://developers.google.com/gemini-code-assist/docs/works)                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |                             |                               |
| [IP indemnification](https://developers.google.com/gemini-code-assist/docs/works#how-gemini-protects)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |                             |                               |
| [VPC-SC and Private Google Access](https://developers.google.com/gemini-code-assist/docs/configure-vpc-service-controls)                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |                             |                               |
| [Customized code suggestions from your code bases in GitHub, GitLab, and Bitbucket in your IDE](https://developers.google.com/gemini-code-assist/docs/code-customization-overview)                                                                                                                                                                                                                                                                                                                                                                                                                     |                             |                               |

### Additional features outside the IDE

The following sections detail additional features available with the Gemini Code Assist Standard and Enterprise editions that go beyond assistance in your IDE.

#### Gemini Cloud Assist

The following table shows the types of generative AI assistance in[Gemini Cloud Assist](https://cloud.google.com/gemini/docs/cloud-assist/overview)in the Google Cloud console:

|                                                                                         Gemini Cloud Assist assistance                                                                                          | Gemini Code Assist Standard | Gemini Code Assist Enterprise |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|-------------------------------|
| [Gemini Cloud Assist features](https://cloud.google.com/gemini/docs/cloud-assist/overview#ai-assistance)(including features available to all Google users and available to Gemini Code Assist Enterprise users) |                             |                               |

#### Gemini in Apigee

The following table shows the types of generative AI assistance with API development in[Apigee](https://cloud.google.com/apigee/docs)(IDE and the Google Cloud console):

|                                                                                                                    Gemini Code Assist for API management                                                                                                                     | Gemini Code Assist Standard | Gemini Code Assist Enterprise |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|-------------------------------|
| [Enterprise context](https://cloud.google.com/apigee/docs/api-platform/local-development/vscode/develop-design-edit-apis#designing-apis-with-gemini-code-assist)used when creating API specifications.                                                                       |                             |                               |
| [Smart Search powered by Vertex AI in API hub.](https://cloud.google.com/apigee/docs/apihub/search-apis)                                                                                                                                                                     |                             |                               |
| [Gemini Code Assist code explained for Apigee policies.](https://cloud.google.com/apigee/docs/api-platform/develop/attaching-and-configuring-policies-management-ui#use-gemini-code-assist-code-explain)([Preview](https://cloud.google.com/products#product-launch-stages)) |                             |                               |

#### Gemini in Application Integration

The following table shows the types of generative AI assistance in[Application Integration](https://cloud.google.com/application-integration/docs/overview)in the Google Cloud console:

|                                                                                Integration creation assist                                                                                | Gemini Code Assist Standard | Gemini Code Assist Enterprise |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|-------------------------------|
| [AI-assisted visual editor for automation flow generation](https://cloud.google.com/application-integration/docs/build-integrations-gemini#create-an-integration)                         |                             |                               |
| [Enterprise context embedded AI-assisted automation authoring](https://cloud.google.com/application-integration/docs/build-integrations-gemini#contextual-recommendations)                |                             |                               |
| [Generative AI Automation flow documentation generation and refinement](https://cloud.google.com/application-integration/docs/build-integrations-gemini#generate-integration-description) |                             |                               |

#### Gemini in BigQuery features with Gemini Code Assist

The following table shows the types of generative AI assistance for BigQuery in[BigQuery Studio](https://cloud.google.com/bigquery/docs/query-overview#bigquery-studio):

|                                                                                   Data insights                                                                                    | Gemini Code Assist Standard | Gemini Code Assist Enterprise |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|-------------------------------|
| [Data insights](https://cloud.google.com/bigquery/docs/data-insights#insights-bigquery-table)provides an insightful library of queries generated from the metadata of your tables. |                             |                               |

#### Gemini in Colab Enterprise

The following table shows the types of generative AI assistance for code in[Colab Enterprise](https://cloud.google.com/colab/docs/introduction):

|                                             Notebook code assist                                             | Gemini Code Assist Standard | Gemini Code Assist Enterprise |
|--------------------------------------------------------------------------------------------------------------|-----------------------------|-------------------------------|
| [Python code generation and completion in notebook](https://cloud.google.com/colab/docs/use-code-completion) |                             |                               |

#### Gemini in databases

The following table shows the types of generative AI assistance for coding in databases:

|                 Generate SQL queries                  | Gemini Code Assist Standard | Gemini Code Assist Enterprise |
|-------------------------------------------------------|-----------------------------|-------------------------------|
| Write in natural language to generate SQL statements. |                             |                               |
| Get contextual code that works with your schema.      |                             |                               |
| Optimize and explain existing queries.                |                             |                               |

#### Gemini in Firebase

The following table shows the types of generative AI assistance for application development provided by[Gemini in Firebase](https://firebase.google.com/docs/gemini-in-firebase):

|                                             Chat AI assistance in the Firebase console                                              | Gemini Code Assist Standard | Gemini Code Assist Enterprise |
|-------------------------------------------------------------------------------------------------------------------------------------|-----------------------------|-------------------------------|
| Use deep knowledge, best practices, and troubleshooting expertise for Firebase products and services.                               |                             |                               |
| Generate, refactor, and debug sample code for Firebase with natural language in chat.                                               |                             |                               |
| Use natural language prompts to explain, generate, and transform code.                                                              |                             |                               |
| Summarize app crashes and provide insights and troubleshooting steps to help developers investigate and resolve app quality issues. |                             |                               |
| Analyze existing code, identify potential issues, and suggest improvements.                                                         |                             |                               |
| Summarize and analyze your messaging campaigns, providing actionable recommendations to improve performance.                        |                             |                               |
| Generate database schemas with natural language.                                                                                    |                             |                               |
| Generate GraphQL queries and mutations with natural language.                                                                       |                             |                               |
| Use project and application context to guide conversational assistance, troubleshooting, and app quality analysis.                  |                             |                               |

## Set up Gemini Code Assist

For detailed setup steps, see:

- [Set up Gemini Code Assist for individuals](https://developers.google.com/gemini-code-assist/docs/set-up-gemini).
- [Set up Gemini Code Assist Standard and Enterprise](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise).

## Interact with Gemini Code Assist in your IDE

After you[set up Gemini Code Assist for individuals](https://developers.google.com/gemini-code-assist/docs/set-up-gemini), or[Gemini Code Assist Standard or Enterprise](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise)and install the Gemini Code Assist extension in your IDE ([VS Code](https://marketplace.visualstudio.com/items?itemName=GoogleCloudTools.cloudcode)or[supported JetBrains IDE](https://plugins.jetbrains.com/plugin/24198-gemini-code-assist)), you can ask for assistance in the following ways:

- Receive code completions or generate code directly in the code editor.

- Clickspark**Gemini**in the IDE to display the conversational assistant. You can ask questions or select code in your editor and enter prompts such as the following:

  - `Write unit tests for my code.`
  - `Help me debug my code.`
  - `Make my code more readable.`

For more information, see[Code with Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/write-code-gemini).

## What's next

- Learn how to[Code with Gemini Code Assist in your IDE](https://developers.google.com/gemini-code-assist/docs/write-code-gemini).
- Learn[how Gemini Code Assist Standard and Enterprise use your data](https://developers.google.com/gemini-code-assist/docs/data-governance).
- Learn about[Gemini Code Assist pricing](https://cloud.google.com/products/gemini/pricing).






[Gemini in Android Studio](https://developer.android.com/studio/gemini/overview), powered by artificial intelligence, is a coding companion for Android development that understands natural language. It helps you be more productive by answering your Android development queries. Gemini Code Assist can help Android developers generate code, find relevant resources, learn best practices, and save time. Gemini in Android Studio can help you with tasks including the following:

- [Code transforms and completion](https://developer.android.com/studio/gemini/code-completion)
- [Naming variables, methods, classes, and methods](https://developer.android.com/studio/gemini/rethink-variable-names)
- [Documenting code](https://developer.android.com/studio/gemini/document-code)
- [Writing commit messages](https://developer.android.com/studio/gemini/generate-commit-messages)
- [Creating compose previews](https://developer.android.com/studio/gemini/generate-compose-previews)
- [Building your app UI based on images](https://developer.android.com/studio/gemini/attach-image)
- [Analyzing crash reports](https://developer.android.com/studio/gemini/analyze-crashes-with-aqi)
- [Writing unit tests](https://developer.android.com/studio/gemini/generate-unit-test-scenarios)

To learn more about Gemini in Android Studio, including how to download Android Studio and get started with Gemini, see[Gemini in Android Studio](https://developer.android.com/gemini-in-android).

To learn more about how Gemini in Android studio handles your data, see[Data and privacy](https://developer.android.com/studio/gemini/data-and-privacy).




The[Gemini command line interface (CLI)](https://geminicli.com/)is an open source AI agent that provides access to Gemini directly in your terminal. The Gemini CLI uses a reason and act (ReAct) loop with your built-in tools and local or remote MCP servers to complete complex use cases like fixing bugs, creating new features, and improving test coverage. While the Gemini CLI excels at coding, it's also a versatile local utility that you can use for a wide range of tasks, from content generation and problem solving to deep research and task management.

Gemini Code Assist for individuals, Standard, and Enterprise each[provide quotas](https://developers.google.com/gemini-code-assist/resources/quotas)for using the Gemini CLI. Note that these quotas are shared between Gemini CLI and Gemini Code Assist agent mode.

The Gemini CLI is available without additional setup in[Cloud Shell](https://cloud.google.com/shell/docs/use-cloud-shell-terminal). To get started with Gemini CLI in other environments, see the[Gemini CLI documentation](https://geminicli.com/).

### Privacy

For users of Gemini Code Assist Standard and Enterprise, the data protection and privacy practices described in[Security, privacy, and compliance for Gemini Code Assist Standard and Enterprise](https://cloud.google.com/gemini/docs/codeassist/security-privacy-compliance)also apply to Gemini CLI.
For users of Gemini Code Assist for individuals, the data protection and privacy practices described in the[Gemini Code Assist Privacy Notice for individuals](https://developers.google.com/gemini-code-assist/resources/privacy-notice-gemini-code-assist-individuals)also apply to Gemini CLI.

## Gemini Code Assist agent mode (Preview)

[Gemini Code Assist agent mode](https://developers.google.com/gemini-code-assist/docs/agent-mode)in VS Code is powered by Gemini CLI. A subset of Gemini CLI functionality is available directly in the Gemini Code Assist chat within your IDE.

The following Gemini CLI features are available in Gemini Code Assist for VS Code.

- [Model Context Protocol (MCP) servers](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer#configure-mcp-servers)
- Gemini CLI[commands](https://geminicli.com/docs/cli/commands/):`/memory`,`/stats`,`/tools`,`/mcp`
- [Yolo mode](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer#yolo-mode)
- built-in tools like grep, terminal, file read or file write
- Web search
- Web fetch




- Gemini Code Assist for individuals:[Terms of Service](https://policies.google.com/terms)and[Privacy Notice](https://developers.google.com/gemini-code-assist/resources/privacy-notice-gemini-code-assist-individuals)

- Gemini Code Assist using a Google AI Pro or Ultra subscription:[Terms of Service](https://policies.google.com/terms),[Google One Additional Terms of Service](https://one.google.com/terms-of-service)and[Privacy Policy](https://policies.google.com/privacy)

- Gemini Code Assist Standard and Enterprise editions:[Terms of Service](https://cloud.google.com/terms)and[Privacy Notice](https://cloud.google.com/terms/cloud-privacy-notice)

- Cloud Code and Gemini Code Assist:[Terms of Service and Privacy Notice](https://cloud.google.com/code/docs/cloud-code-gemini-code-assist-data-governance)

- Gemini Code Assist on GitHub, consumer version:[Terms of Service](https://policies.google.com/terms)and[Privacy Policy](https://policies.google.com/privacy)

- Gemini Code Assist on GitHub, enterprise version:[Terms of Service](https://cloud.google.com/terms/)and[Privacy Notice](https://cloud.google.com/terms/cloud-privacy-notice)

If you have an active subscription to Gemini Code Assist Standard or Enterprise edition, the terms and privacy policy of Gemini Code Assist Standard or Enterprise edition applies to all your use of Gemini Code Assist, with the exception of any use of Gemini Code Assist on GitHub.





This notice and our[Privacy Policy](https://policies.google.com/privacy)describe how Gemini Code Assist for individuals handles your data. Please read them carefully.

When you use Gemini Code Assist for individuals, Google collects your prompts, related code, generated output, code edits, related feature usage information, and your feedback to provide, improve, and develop Google products and services and machine learning technologies.

To help with quality and improve our products (such as generative machine-learning models), human reviewers may read, annotate, and process the data collected above. We take steps to protect your privacy as part of this process. This includes disconnecting the data from your Google Account before reviewers see or annotate it, and storing those disconnected copies for up to 18 months. Please don't submit confidential information or any data you wouldn't want a reviewer to see or Google to use to improve our products, services, and machine-learning technologies.

If you don't want this data used to improve Google's machine learning models, you can opt out by following the steps in[Set up Gemini Code Assist for individuals](https://developers.google.com/gemini-code-assist/docs/set-up-gemini#read-privacy-notice).







This document describes the languages, IDEs, and code infrastructure interfaces that Gemini Code Assist supports.

## Supported languages for prompts

Gemini Code Assist supports the following languages:

- Arabic (ar)
- Bengali (bn)
- Bulgarian (bg)
- Chinese simplified and traditional (zh)
- Croatian (hr)
- Czech (cs)
- Danish (da)
- Dutch (nl)
- English (en)
- Estonian (et)
- Finnish (fi)
- French (fr)
- German (de)
- Greek (el)
- Hebrew (he)
- Hindi (hi)
- Hungarian (hu)
- Indonesian (id)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Latvian (lv)
- Lithuanian (lt)
- Norwegian (no)
- Polish (pl)
- Portuguese (pt)
- Romanian (ro)
- Russian (ru)
- Serbian (sr)
- Slovak (sk)
- Slovenian (sl)
- Spanish (es)
- Swahili (sw)
- Swedish (sv)
- Thai (th)
- Turkish (tr)
- Ukrainian (uk)
- Vietnamese (vi)

## Verified coding languages

The Gemini large language models (LLMs) that are used by Gemini for Google Cloud are trained on a vast set of coding examples within the public domain. Therefore, LLMs are often able to understand and provide assistance on a wide variety of coding languages. However, due to the large number of languages, the testing of the quality of the assistance varies by coding language. Therefore, Google chose a subset of coding languages to verify the quality of assistance and responses.

Although Gemini Code Assist can offer assistance on a wide variety of coding languages, Google has*verified*the following coding languages:

- [Bash](https://www.gnu.org/software/bash/)
- [C](https://www.open-std.org/JTC1/SC22/WG14/www/standards)
- [C++](https://isocpp.org/)
- [C#](https://learn.microsoft.com/en-us/dotnet/csharp/)
- [Dart](https://dart.dev/)
- [Go](https://go.dev/)
- [GoogleSQL](https://developers.google.com/bigquery/docs/introduction-sql)
- [Java](https://docs.oracle.com/javase/8/docs/technotes/guides/language/index.html)
- [JavaScript](https://www.javascript.com/)
- [Kotlin](https://kotlinlang.org/)
- [Lua](https://www.lua.org/)
- [MATLAB](https://www.mathworks.com/products/matlab.html)
- [PHP](https://www.php.net/)
- [Python](https://www.python.org/)
- [R](https://www.r-project.org/)
- [Ruby](https://www.ruby-lang.org/en/)
- [Rust](https://www.rust-lang.org/)
- [Scala](https://www.scala-lang.org/)
- [SQL](https://blog.ansi.org/sql-standard-iso-iec-9075-2023-ansi-x3-135/)
- [Swift](https://developer.apple.com/swift/)
- [TypeScript](https://www.typescriptlang.org/)
- [YAML](https://yaml.org/)

## Supported IDEs

Gemini Code Assist is available by default in the following IDEs:

- [Cloud Shell](https://cloud.google.com/shell)
- [Cloud Workstations](https://cloud.google.com/workstations)
- [Android Studio](https://developer.android.com/studio/gemini/overview)

The Gemini Code Assist extension is supported in the following IDEs:

- [VS Code](https://code.visualstudio.com/)
- JetBrains IDEs:
  - [CLion](https://www.jetbrains.com/clion/)
  - [DataGrip](https://www.jetbrains.com/datagrip/)
  - [GoLand](https://www.jetbrains.com/go/)
  - [IntelliJ IDEA Community, Educational, and Ultimate](https://www.jetbrains.com/idea/download/)
  - [PhpStorm](https://www.jetbrains.com/phpstorm/)
  - [PyCharm Community and Professional](https://www.jetbrains.com/pycharm/)
  - [Rider](https://www.jetbrains.com/rider/)
  - [RubyMine](https://www.jetbrains.com/ruby/)
  - [WebStorm](https://www.jetbrains.com/webstorm/)

## Supported code infrastructure interfaces

Gemini Code Assist can offer assistance with the following infrastructure as code interfaces:

- [Gemini CLI](https://github.com/google-gemini/gemini-cli)

<!-- -->

- [Google Cloud CLI](https://cloud.google.com/cli)

<!-- -->

- [Kubernetes Resource Model (KRM)](https://github.com/kubernetes/design-proposals-archive/blob/main/architecture/resource-management.md)

## What's next

- Learn how to[set up Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/set-up-gemini)at no cost, or if you prefer to get started with Gemini Code Assist Standard or Enterprise, see[Set up Gemini Code Assist (Standard and Enterprise)](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise).
- Learn[how Gemini for Google Cloud uses your data](https://developers.google.com/gemini-code-assist/docs/data-governance).
- Learn more about[Google Cloud compliance](https://cloud.google.com/compliance).




The Gemini large language models (LLMs) that are used by Gemini Code Assist are trained on datasets of publicly available code, Google Cloud-specific material, and other relevant technical information in addition to the datasets used to train the Gemini[foundation models](https://storage.googleapis.com/deepmind-media/gemini/gemini_1_report.pdf). Models are trained so that Gemini Code Assist responses are as useful to Gemini Code Assist users as possible.

Gemini Code Assist Standard and Enterprise don't use your prompts or generated responses for training or fine-tuning our underlying models. Gemini Code Assist Standard and Enterprise editions use your data strictly for serving a response to the request, and unless instructed by you, isn't stored.

## How and when Gemini Code Assist cites sources

Gemini Code Assist LLMs, like some other standalone LLM experiences, are intended to generate original content and not replicate existing content at length. We've designed our systems to limit the chances of this occurring, and we continue to improve how these systems function.

If Gemini Code Assist directly quotes at length from a web page, it cites that page. For answers with URLs, Gemini Code Assist lets users see and, in some cases, click to navigate directly to the source page.

When generating code or offering code completion, Gemini Code Assist provides citation information when it directly quotes at length from another source, such as existing open source code. In the case of citations to code repositories, the citation might also reference an applicable open source license.

To allow for better code generation in IDEs, Gemini Code Assist gathers contextual information from the file that you're actively using in your IDE as well as other open and relevant local files in your project.

When working with Gemini Code Assist in your IDE, Gemini lists your project files (the context sources) that were used as reference to generate responses to your prompts. Context sources are shown every time you use Gemini chat.

You can prevent Gemini Code Assist from suggesting code that matches cited sources by adjusting settings in[VS Code](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#disable_code_suggestions_that_match_cited_sources).

[Code customization](https://developers.google.com/gemini-code-assist/docs/code-customization-overview)in Gemini Code Assist Enterprise lets you get code suggestions based on your organization's private codebase directly from Gemini Code Assist. To learn more about code customization, and how we provide security when accessing and storing your private code, see the[Gemini Code Assist overview](https://developers.google.com/gemini-code-assist/docs/code-customization-overview). To configure and use code customization, see[Configure and use Gemini Code Assist code customization](https://developers.google.com/gemini-code-assist/docs/code-customization).

For more information about Gemini Code Assist Standard and Enterprise security controls, see[Security, privacy, and compliance for Gemini Code Assist Standard and Enterprise](https://cloud.google.com/gemini/docs/codeassist/security-privacy-compliance).









Gemini 3 has been released and is progressively being made available to Gemini Code Assist users in VS Code and IntelliJ. Initially, Gemini 3 is only being made available in[agent mode](https://developers.google.com/gemini-code-assist/docs/agent-mode).

Once enabled, Gemini Code Assist tries to use Gemini 3 unless otherwise configured using the model selector (VS Code only). When Gemini Code Assist tries to use Gemini 3, it falls back to other models, such as Gemini 2.5 Pro, if capacity is unavailable or quotas are exceeded. Responses include a label when they are generated using Gemini 3.

## Get Access to Gemini 3

|       License / Subscription       |                                                               Gemini 3 Availability                                                               |
|------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| Google AI Ultra                    | **Available now** to all users in IntelliJ;**Available soon**to all users in VS Code                                                              |
| Google AI Pro                      | [Join the waitlist](https://docs.google.com/forms/d/e/1FAIpQLScQBMmnXxIYDnZhPtTP3xr5IwHNzKW4nLomuQ1tGOO-UldMdQ/viewform)                          |
| Gemini Code Assist Enterprise      | **Available soon** to all users in the[Preview release channel](https://developers.google.com/gemini-code-assist/docs/configure-release-channels) |
| Gemini Code Assist Standard        | [Join the waitlist](https://docs.google.com/forms/d/e/1FAIpQLScQBMmnXxIYDnZhPtTP3xr5IwHNzKW4nLomuQ1tGOO-UldMdQ/viewform)                          |
| Gemini Code Assist for individuals | [Join the waitlist](https://docs.google.com/forms/d/e/1FAIpQLScQBMmnXxIYDnZhPtTP3xr5IwHNzKW4nLomuQ1tGOO-UldMdQ/viewform)                          |
| Google Developer Program           | [Join the waitlist](https://docs.google.com/forms/d/e/1FAIpQLScQBMmnXxIYDnZhPtTP3xr5IwHNzKW4nLomuQ1tGOO-UldMdQ/viewform)                          |

## Use Gemini 3 in Agent Mode

### VS Code

Gemini 3 must be enabled in the Gemini CLI to be used in Agent Mode in VS Code.

1. Close VS Code.

2. Install[Gemini CLI](https://geminicli.com/docs/get-started/deployment/)version 0.16 or later if you haven't already done so.

3. Run Gemini CLI after installation using the following command:

   ```
   gemini
   ```
4. In the Gemini CLI, open settings using the following command:

   ```
   /settings
   ```
5. Navigate to the**Preview Features**setting and enable it.

6. Reopen VS Code.

Once Gemini 3 is enabled for your license or subscription, and Preview Features are enabled in Gemini CLI, Gemini 3 works for Agent Mode in VS Code and falls back to other models, such as Gemini 2.5 Pro, if capacity is unavailable or quotas are exceeded.

### IntelliJ

Once Gemini 3 is enabled for your license or subscription, Gemini 3 automatically works for Agent Mode in IntelliJ and falls back to other models, such as Gemini 2.5 Pro, if capacity is unavailable or quotas are exceeded.






This document describes how Gemini Code Assist Standard and Enterprise editions, which offer AI-powered assistance, conform to[Google's privacy commitment](https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-unveils-ai-and-ml-privacy-commitment)with generative AI technologies. When you use Gemini Code Assist Standard or Enterprise editions in a development environment, Google Cloud[handles your prompts](https://developers.google.com/gemini-code-assist/docs/data-governance#submit-receive-data)in accordance with our[terms of service](https://cloud.google.com/terms)and[Cloud Data Processing Addendum](https://cloud.google.com/terms/data-processing-addendum).

For more information about Gemini Code Assist Standard and Enterprise editions, see the[Gemini Code Assist overview](https://developers.google.com/gemini-code-assist/docs/overview).

## Google's privacy commitment

Google was one of the first in the industry to publish an[AI/ML privacy commitment](https://cloud.google.com/blog/products/ai-machine-learning/google-cloud-unveils-ai-and-ml-privacy-commitment), which outlines our belief that customers should have the highest level of security and control over their data that's stored in the cloud. That commitment extends to Gemini Code Assist Standard and Enterprise edition generative AI products. Google helps ensure that its teams are following these commitments through robust data governance practices, which include reviews of the data that Google Cloud uses in the development of its products. You can find more details about how Google processes data in[Customer Data Processing Addendum (CDPA)](https://cloud.google.com/terms/data-processing-addendum)or the data processing agreement applicable to your Google Cloud service.

## Data you submit and receive

The questions that you ask Gemini, including any input information or code that you submit to Gemini to analyze or complete, are called*prompts* . The answers or code completions that you receive from Gemini are called*responses*.

Gemini Code Assist Standard and Enterprise editions don't use your prompts or its responses as data to train its models. Some features are only available through the[Gemini for Google Cloud Trusted Tester Program](https://cloud.google.com/gemini-for-cloud/ttp/welcome), which lets you optionally share data, but the data is used for product improvements, not for training Gemini models.

[Code customization](https://developers.google.com/gemini-code-assist/docs/code-customization-overview)in Gemini Code Assist Enterprise lets you get code suggestions based on your organization's private codebase directly from Gemini Code Assist. When you use code customization, we securely access and store your private code. This access and storage is essential for delivering the code customization service you've requested. To configure and use code customization, see[Configure and use Gemini Code Assist code customization](https://developers.google.com/gemini-code-assist/docs/code-customization).

Because Gemini is an evolving technology, it can generate output that's plausible-sounding but factually incorrect. We recommend that you validate all output from Gemini before you use it. For more information, see[Gemini Code Assist and responsible AI](https://developers.google.com/gemini-code-assist/docs/responsible-ai).

## Encryption of prompts

When you submit prompts to Gemini, your data is encrypted in-transit as input to the underlying model in Gemini. For more information on Gemini data encryption, see[Default encryption at rest](https://cloud.google.com/docs/security/encryption/default-encryption)and[Encryption in transit](https://cloud.google.com/docs/security/encryption-in-transit).

## Program data generated from Gemini

Gemini is trained on first-party Google Cloud code as well as selected third-party code. You're responsible for the security, testing, and effectiveness of your code, including any code completion, generation, or analysis that Gemini offers you.

Gemini also provides source citations when suggestions directly quote at length from a source to help you comply with any license requirements.

Because responses in Gemini are generated from a model that's trained on many lines of code, you should exercise the same care with Gemini-provided code that you would with any other code. Make sure that you test the code properly and check for security vulnerabilities, incompatibilities, and other potential issues.

## What's next

- Learn about the[security, privacy, and compliance of Gemini Code Assist](https://cloud.google.com/gemini/docs/codeassist/security-privacy-compliance).





This document describes how Gemini Code Assist is designed in view of the capabilities, limitations, and risks that are associated with generative AI.

## Capabilities and risks of large language models

Large language models (LLMs) can perform many useful tasks such as the following:

- Translate language.
- Summarize text.
- Generate code and creative writing.
- Power chatbots and virtual assistants.
- Complement search engines and recommendation systems.

At the same time, the evolving technical capabilities of LLMs create the potential for misapplication, misuse, and unintended or unforeseen consequences.

LLMs can generate output that you don't expect, including text that's offensive, insensitive, or factually incorrect. Because LLMs are incredibly versatile, it can be difficult to predict exactly what kinds of unintended or unforeseen outputs they might produce.

Given these risks and complexities, Gemini Code Assist is designed with[Google's AI principles](https://ai.google/responsibility/principles/)in mind. However, it's important for users to understand some of the limitations of Gemini Code Assist to work safely and responsibly.

## Gemini Code Assist limitations

Some of the limitations that you might encounter using Gemini Code Assist include (but aren't limited to) the following:

- **Edge cases.**Edge cases refer to unusual, rare, or exceptional situations that aren't well represented in the training data. These cases can lead to limitations in the output of Gemini Code Assist models, such as model overconfidence, misinterpretation of context, or inappropriate outputs.

- **Model hallucinations, grounding, and factuality.** Gemini Code Assist models might lack grounding and factuality in real-world knowledge, physical properties, or accurate understanding. This limitation can lead to model hallucinations, where Gemini Code Assist might generate outputs that are plausible-sounding but factually incorrect, irrelevant, inappropriate, or nonsensical. Hallucinations can also include fabricating links to web pages that don't exist and have never existed. For more information, see[Write better prompts for Gemini for Google Cloud](https://cloud.google.com/gemini/docs/discover/write-prompts).

- **Data quality and tuning.**The quality, accuracy, and bias of the prompt data that's entered into Gemini Code Assist products can have a significant impact on its performance. If users enter inaccurate or incorrect prompts, Gemini Code Assist might return suboptimal or false responses.

- **Bias amplification.**Language models can inadvertently amplify existing biases in their training data, leading to outputs that might further reinforce societal prejudices and unequal treatment of certain groups.

- **Language quality.**While Gemini Code Assist yields impressive multilingual capabilities on the benchmarks that we evaluated against, the majority of our benchmarks (including all of the fairness evaluations) are in American English.

  Language models might provide inconsistent service quality to different users. For example, text generation might not be as effective for some dialects or language varieties because they are underrepresented in the training data. Performance might be worse for non-English languages or English language varieties with less representation.
- **Fairness benchmarks and subgroups.**Google Research's fairness analyses of Gemini models don't provide an exhaustive account of the various potential risks. For example, we focus on biases along gender, race, ethnicity, and religion axes, but perform the analysis only on the American English language data and model outputs.

- **Limited domain expertise.**Gemini models have been trained on Google Cloud technology, but it might lack the depth of knowledge that's required to provide accurate and detailed responses on highly specialized or technical topics, leading to superficial or incorrect information.

## Gemini safety and toxicity filtering

Gemini Code Assist prompts and responses are checked against a comprehensive list of safety attributes as applicable for each use case. These safety attributes aim to filter out content that violates our[Acceptable Use Policy](https://cloud.google.com/terms/aup). If an output is considered harmful, the response will be blocked.

## What's next

- Learn more about[how Gemini Code Assist cites sources when helps you generate code](https://developers.google.com/gemini-code-assist/docs/works#how-when-gemini-cites-sources).






<br />

This document describes how to get AI-powered assistance in the[Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/overview)chat in your integrated development environment (IDE).

Gemini Code Assist chat lets you write natural language statements or questions (called*prompts*) to get in-depth explanations of your code, suggested actions, or guided workflows that help you complete tasks quickly and efficiently without leaving the IDE.

## Open Gemini Code Assist chat

To open Gemini Code Assist chat in the IDE:  

### VS Code

1. In the activity bar of your IDE, clickspark**Gemini Code Assist**.

2. In the**Gemini Code Assist** chat, enter a prompt and then clicksend**Send**.

### IntelliJ

In the Gemini Code Assist tool window, enter a prompt and then click**Submit**.

## View query history

### VS Code

If you want to re-use your previous prompts, you can find them in your**Query History** in the**Gemini Code Assist** tool window by clickingschedule**Show Query History**.

![Gemini Query History in the tool window.](https://docs.cloud.google.com/code/docs/vscode/images/gemini-code-assist-query-history.png)

### IntelliJ

If you want to re-use your previous prompts, you can find them in your**Query History** in the**Gemini Code Assist** tool window by clickingschedule**Show Query History**.

![Gemini Query History in the tool window.](https://cloud.google.com/code/docs/intellij/images/gemini-code-assist-query-history.png)

## Clear chat history

Gemini Code Assist uses the chat history for additional context when responding to your prompts. If your chat history is no longer relevant to what you're trying to achieve, you can clear the chat history:  

### VS Code

1. In the**Gemini Code Assist** pane, clickhistory**Resume Previous Chat**.

2. When the previous chats appear in the**Select chat** menu, hold your pointer over the chat that you want to clear, and select**Delete**.

   ![Button to clear conversation history in Gemini VS Code.](https://cloud.google.com/gemini/images/vscode-clear-history.png)
   | **Note:** Your chat threads persist across IDE sessions until you clear your history.
3. When prompted to confirm the deletion of the chat thread, select**Delete**.

### IntelliJ

1. In the**Gemini Code Assist** tool window, clickchat_bubble**Recent Chats**.

2. When the previous chats appear in the**Recent Chats** menu, hold your pointer over the chat that you want to clear, and selectdelete**Delete**.

   ![Button to clear conversation history in Gemini tool window.](https://cloud.google.com/gemini/images/intellij-clear-history.png)
   | **Note:** Your query and conversation history persist across IDE sessions until you clear the history.

## What's next

For more information on using Gemini Code Assist in the IDE, see[Code with Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/write-code-gemini).








<br />

This document describes how to get AI-powered assistance in the[Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/overview)chat in your integrated development environment (IDE).

Gemini Code Assist chat lets you write natural language statements or questions (called*prompts*) to get in-depth explanations of your code, suggested actions, or guided workflows that help you complete tasks quickly and efficiently without leaving the IDE.

## Open Gemini Code Assist chat

To open Gemini Code Assist chat in the IDE:  

### VS Code

1. In the activity bar of your IDE, clickspark**Gemini Code Assist**.

2. In the**Gemini Code Assist** chat, enter a prompt and then clicksend**Send**.

### IntelliJ

In the Gemini Code Assist tool window, enter a prompt and then click**Submit**.

## View query history

### VS Code

If you want to re-use your previous prompts, you can find them in your**Query History** in the**Gemini Code Assist** tool window by clickingschedule**Show Query History**.

![Gemini Query History in the tool window.](https://docs.cloud.google.com/code/docs/vscode/images/gemini-code-assist-query-history.png)

### IntelliJ

If you want to re-use your previous prompts, you can find them in your**Query History** in the**Gemini Code Assist** tool window by clickingschedule**Show Query History**.

![Gemini Query History in the tool window.](https://cloud.google.com/code/docs/intellij/images/gemini-code-assist-query-history.png)

## Clear chat history

Gemini Code Assist uses the chat history for additional context when responding to your prompts. If your chat history is no longer relevant to what you're trying to achieve, you can clear the chat history:  

### VS Code

1. In the**Gemini Code Assist** pane, clickhistory**Resume Previous Chat**.

2. When the previous chats appear in the**Select chat** menu, hold your pointer over the chat that you want to clear, and select**Delete**.

   ![Button to clear conversation history in Gemini VS Code.](https://cloud.google.com/gemini/images/vscode-clear-history.png)
   | **Note:** Your chat threads persist across IDE sessions until you clear your history.
3. When prompted to confirm the deletion of the chat thread, select**Delete**.

### IntelliJ

1. In the**Gemini Code Assist** tool window, clickchat_bubble**Recent Chats**.

2. When the previous chats appear in the**Recent Chats** menu, hold your pointer over the chat that you want to clear, and selectdelete**Delete**.

   ![Button to clear conversation history in Gemini tool window.](https://cloud.google.com/gemini/images/intellij-clear-history.png)
   | **Note:** Your query and conversation history persist across IDE sessions until you clear the history.

## What's next

For more information on using Gemini Code Assist in the IDE, see[Code with Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/write-code-gemini).





Before you can use[Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/overview)Standard or Enterprise, your team needs to perform the setup steps that are described in this document:
| **Note:** An administrator typically performs steps 1-4.

1. [Purchase a subscription to Gemini Code Assist Standard or Enterprise](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise#purchase-subscription).

2. [Assign licenses to users in your organization](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise#assign_licenses).

3. [Enable the Gemini for Google Cloud API in a Google Cloud project](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise#enable-api).

4. [Grant Identity and Access Management roles in a Google Cloud project](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise#grant-iam).

5. Your organization's users[install the Gemini Code Assist plugin](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise#install-gemini-code-assist)to use Gemini Code Assist Standard or Enterprise in an IDE. This step isn't required for Gemini CLI users or[Gemini in Android Studio](https://developer.android.com/studio/gemini/overview)users.

## Purchase a Gemini Code Assist subscription

For a list of features available in each edition, see[Supported features](https://developers.google.com/gemini-code-assist/docs/overview#supported-features).

For new Gemini Code Assist customers with billing accounts that never had a Gemini Code Assist subscription, we automatically apply credits equivalent to up to 50 free licenses for the first month, regardless of[Gemini Code Assist edition](https://cloud.google.com/gemini/docs/codeassist/overview#supported-features). Note that you cannot increase the number of free credits after the initial free license credits are allotted. Additionally, you cannot change the Gemini Code Assist edition within the first month.

If you have existing contracts with Google Cloud,[contact our sales team](https://cloud.google.com/contact/)before purchasing a subscription.
| **Note:** You must have the`consumerprocurement.orders.place`Identity and Access Management permission on the billing account to purchase a Gemini subscription. The`consumerprocurement.orders.place`permission is included in the[`roles/billing.admin`IAM role](https://cloud.google.com/billing/docs/how-to/billing-access#billing.admin)or the[`roles/consumerprocurement.orderAdmin`role](https://cloud.google.com/marketplace/docs/access-control#consumerprocurement.orderAdmin). Alternatively, you can add the permission to a custom role.

1. Go to the**Admin for Gemini**page.

   [Go to Admin for Gemini](https://console.cloud.google.com/gemini-admin)

   The**Admin for Gemini**page opens.
2. Select**Get Gemini Code Assist**.

   Note that if you don't have the required`consumerprocurement.orders.place`permission, then this button is disabled. If a Gemini Code Assist subscription already exists for the billing account associated with the project, this button displays as**Manage Gemini Code Assist** and lets you[edit your subscription](https://developers.google.com/gemini/docs/admin).

   The**Get Gemini Code Assist subscription**page opens.
3. In**Select Gemini Code Assist subscription Edition** , select a Gemini Code Assist edition. Select**Compare Gemini Code Assist Editions** to see a detailed list of[features available to each edition](https://developers.google.com/gemini-code-assist/docs/overview#supported-features).

   Then, select**Continue**.
4. In**Configure subscription**, complete the fields to configure the subscription, including the following:

   - Subscription name.
   - Number of licenses in the subscription. Note that if you are purchasing Enterprise edition, then you must purchase at least 10 licenses.
   - Subscription period (monthly or yearly). With an annual subscription, you are given a discounted rate that is charged on a monthly basis rather than a one-time payment.

   By default, new subscriptions are set up for automatic license assignment. A user in your organization is automatically assigned a license when they use Gemini Code Assist within a supported IDE, provided all the following conditions are met:
   - The user has selected a project that is associated with the subscription's billing account.
   - The user has the`cloudaicompanion.licences.selfAssign`IAM permission on the selected project.

   After you set up Gemini Code Assist, you can then choose to assign licenses[manually](https://developers.google.com/gemini-code-assist/docs/manage-licenses#manual).
5. To confirm the subscription, select**Continue**.

6. If you agree to the terms, select**I agree to the terms of this purchase** , and then select**Confirm subscription**.

7. Select**Next: Manage Gemini License Assignments**.

The subscription is now purchased for Gemini Code Assist Standard or Enterprise. You now need to manage Gemini license assignments in your organization.

## Assign licenses

Before using a Gemini Code Assist license, users must have the Gemini for Google Cloud User role or analogous permissions on a project where the API is already enabled.

For new Gemini Code Assist customers with billing accounts that never had a Gemini Code Assist subscription, we automatically apply credits equivalent to up to 50 free licenses for the first month, regardless of[Gemini Code Assist edition](https://cloud.google.com/gemini/docs/codeassist/overview#supported-features). Note that you cannot increase the number of free credits after the initial free license credits are allotted. Additionally, you cannot change the Gemini Code Assist edition within the first month.

By default, new subscriptions are set up for automatic license assignment. A user in your organization is automatically assigned a license when they use Gemini Code Assist within a supported IDE, provided all the following conditions are met:

- The user has selected a project that is associated with the subscription's billing account.
- The user has the`cloudaicompanion.licences.selfAssign`IAM permission on the selected project.

If a license is inactive for 30 days, then it will be automatically assigned to another user in your organization who meets the preceding conditions.

After you set up Gemini Code Assist, you can view license assignments by navigating to the**Admin for Gemini** page, selecting your billing account, clicking**Manage Gemini Code Assist Subscription** , and then selecting the**License management** tab. If you require finer control over license assignments, you can also use this tab to switch from automatic license management to[manual license management](https://developers.google.com/gemini-code-assist/docs/manage-licenses#manual).

The[Gemini for Google Cloud API](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise#enable-api)must be enabled in one or more projects that are associated with this billing account. Users won't see Gemini Code Assist until you activate it in at least one project.

## Enable the Gemini for Google Cloud API in a Cloud project

This section describes the steps required to enable the Gemini for Google Cloud API in a Cloud project. Gemini Code Assist requires a Cloud project to manage API access, quota, and billing. For this reason, you need to enable the Gemini for Google Cloud API in a Cloud project of your choice before users can access Gemini Code Assist.  

### Console

1. To enable the Gemini for Google Cloud API, go to the**Gemini for Google Cloud**page.

   [Go to Gemini for Google Cloud](https://console.cloud.google.com/marketplace/product/google/cloudaicompanion.googleapis.com)
2. In the project selector, select a project.

3. Click**Enable**.

   The page updates and shows a status of**Enabled**. Gemini is now available in the selected Cloud project to all users who have the required IAM roles.

### gcloud

To use a local development environment,[install](https://cloud.google.com/sdk/docs/install)and[initialize](https://cloud.google.com/sdk/docs/initializing)the gcloud CLI.

1. In the project selector menu, select a project.

2. Enable the Gemini for Google Cloud API for Gemini using the[`gcloud services enable`command](https://cloud.google.com/sdk/gcloud/reference/services/enable):

       gcloud services enable cloudaicompanion.googleapis.com

   If you want to enable the Gemini for Google Cloud API in a different Cloud project, add the`--project`parameter:  

       gcloud services enable cloudaicompanion.googleapis.com --project <var translate="no">PROJECT_ID</var>

   Replace<var translate="no">PROJECT_ID</var>with your Cloud project ID.

   The output is similar to the following:  

   ```
   Waiting for async operation operations/acf.2e2fcfce-8327-4984-9040-a67777082687 to complete...
   Operation finished successfully.
   ```

Gemini for Google Cloud is now available in the specified Cloud project to all users who have the[required IAM roles](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise#grant-iam).

### Configure the firewall for API traffic between your IDE and Google

In addition to enabling the Gemini for Google Cloud, users behind firewalls also need to allow traffic to pass through for the following APIs:

- [`oauth2.googleapis.com`](https://developers.google.com/identity/protocols/oauth2): used to sign in to Google Cloud.
- [`serviceusage.googleapis.com`](https://console.cloud.google.com/marketplace/product/google/serviceusage.googleapis.com): used for checking that the user's Gemini Code Assist project is properly configured.
- [`cloudaicompanion.googleapis.com`](https://console.cloud.google.com/marketplace/product/google/cloudaicompanion.googleapis.com): the primary Gemini for Google Cloud API endpoint.
- `cloudcode-pa.googleapis.com`: an internal API that provides IDE-related features.
- [`cloudresourcemanager.googleapis.com`](https://console.cloud.google.com/marketplace/product/google/cloudresourcemanager.googleapis.com): used in the IDEs for project pickers. The Resource Manager API may not be necessary if the projects are explicitly configured in your`settings.json`file.
- [`people.googleapis.com`](https://console.cloud.google.com/marketplace/product/google/people.googleapis.com): provides access to information about profiles and contacts.
- `firebaselogging-pa.googleapis.com`: an internal API used for sending product telemetry including events as to whether suggestions were accepted.
- `feedback-pa.googleapis.com`: an internal API used for in-IDE feedback submission.
- [`apihub.googleapis.com`](https://console.cloud.google.com/marketplace/product/google/apihub.googleapis.com): used by the Cloud Code API Browser feature.
- `lh3.googleusercontent.com`and`lh5.googleusercontent.com`: used to obtain user photos.

### Determine IP addresses for Google Cloud default domains

To enable connectivity from your IDE to Google Cloud APIs, your firewall must allow outbound TCP traffic to Google's publicly documented IP address ranges. These ranges are dynamically managed by Google.

To maintain a list of IP ranges to access Google Cloud domains, you have several options:

- Use our published lists or automate a script to[obtain Google IP address ranges](https://support.google.com/a/answer/10026322).
- Use the[private.googleapis.com Virtual IP](https://developers.google.com/vpc/docs/configure-private-google-access#domain-options).
- Use[Private Service Connect](https://developers.google.com/vpc/docs/configure-private-service-connect-apis).

### Optional: Configure VPC Service Controls

If your organization has a service perimeter, then you must add the following resources to your perimeter:

- Gemini for Google Cloud API
- Gemini Code Assist API

If you are using Gemini Code Assist Standard or Enterprise from outside of your service perimeter, then you also need to modify the ingress policy to allow access to those services.

For more information, see[Configure VPC Service Controls for Gemini](https://developers.google.com/gemini-code-assist/docs/configure-vpc-service-controls).

## Grant IAM roles in a Google Cloud project

This section describes the steps required to grant the Gemini for Google Cloud User and Service Usage Consumer IAM roles to users.  

### Console

1. To grant the IAM roles that are required to use Gemini, go to the**IAM \& Admin**page.

   [Go to IAM \& Admin](https://console.cloud.google.com/projectselector/iam-admin/iam?supportedpurview)
2. Click**Grant access** , and then enter the[principal](https://cloud.google.com/iam/docs/overview#concepts_related_identity)name for which you want to give access to Gemini.

3. In the**Grant access** pane, clickadd**Add another role**.

4. In**Assign roles** , select**Gemini for Google Cloud User**.

5. Click**Add roles** and select**Service Usage Consumer**.

6. Click**Save**.

### gcloud

To use a local development environment,[install](https://cloud.google.com/sdk/docs/install)and[initialize](https://cloud.google.com/sdk/docs/initializing)the gcloud CLI.

1. In the project selector menu, select a project.

2. Grant the Gemini for Google Cloud User role:

   ```
   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member=PRINCIPAL --role=roles/cloudaicompanion.user
   ```

   Replace the following:
   - <var translate="no">PROJECT_ID</var>: the ID of your Cloud project---for example,`1234567890`.
   - <var translate="no">PRINCIPAL</var>: the[identifier](https://developers.google.com/iam/docs/principal-identifiers)for the principal---for example,`user:cloudysanfrancisco@gmail.com`.

   The output is a list of policy bindings that includes the following:  

       - members:
         - user:<var translate="no">PRINCIPAL</var>
         role: roles/cloudaicompanion.user

3. Repeat the previous step for the role`roles/serviceusage.serviceUsageConsumer`.

For more information, see[Grant a single role](https://cloud.google.com/iam/docs/granting-changing-revoking-access#grant-single-role)and[`gcloud projects add-iam-policy-binding`](https://cloud.google.com/sdk/gcloud/reference/projects/add-iam-policy-binding).

All of the users who have been granted these roles can access Gemini for Google Cloud features in the Google Cloud console within the specified project. For more information, see[Gemini for Google Cloud overview](https://cloud.google.com/gemini/docs/overview).

## Install the Gemini Code Assist plugin

Your organization's users install the Gemini Code Assist plugin in their preferred[supported IDE](https://developers.google.com/gemini-code-assist/docs/supported-languages#supported_ides). Users of supported JetBrains IDEs should follow the IntelliJ instructions.  

### VS Code

1. To open the**Extensions** view in VS Code, click![Extension icon](https://cloud.google.com/code/docs/vscode/images/vscodeextension.png)**Extensions** or press`Ctrl`/`Cmd`+`Shift`+`X`.

2. Search for`Gemini Code Assist`.

3. Click**Install**.

4. If prompted, restart VS Code.

   After the extension has successfully installed, Gemini Code Assist appears in the activity bar and is ready for use. You can further configure your Gemini Code Assist installation by specifying your preferences using the top-level application taskbar: navigate to**Code** \>**Settings** \>**Settings** \>**Extensions** and search for`Gemini Code Assist`.

### IntelliJ

1. Clicksettings**IDE and Project Settings** \>**Plugins**.
2. In the**Marketplace** tab, search for`Gemini Code Assist`.
3. Click**Install**to install the plugin.
4. When the installation is finished, click**Restart IDE**.
5. When the IDE restarts, Gemini Code Assist appears in your activity bar.

   ![The Gemini Code Assist icon appears in the activity bar.](https://cloud.google.com/code/docs/intellij/images/gemini-code-assist-icon-in-activity-bar.png)

Now the users are ready to use Gemini Code Assist Standard or Enterprise in their IDE. Learn more about the supported features:

- [Code features overview](https://developers.google.com/gemini-code-assist/docs/code-overview)
- [Chat features overview](https://developers.google.com/gemini-code-assist/docs/chat-overview)

Get started with the following guides:

- [Code with Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/write-code-gemini)
- [Chat with Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/chat-gemini)

### List of directories where Gemini Code Assist caches information

The following table provides a list of directories where Gemini Code Assist stores extension information such as auth tokens:  

### Windows

- `%LOCALAPPDATA%/cloud-code`
- `%LOCALAPPDATA%/google-vscode-extension`

### macOS

- `~/Library/Application Support/cloud-code`
- `~/Library/Application Support/google-vscode-extension`

### Linux

- `~/.cache/cloud-code`
- `~/.cache/google-vscode-extension`

## Sign into Google and select a Google Cloud project

Once users have installed Gemini Code Assist in their IDEs, they need to sign in to their Google Accounts, and if it's their first time using Gemini Code Assist Standard or Enterprise in their IDE, they select a Google Cloud project. This is the same project used to set up Gemini Code Assist, and is used to manage API access, quota, and billing.  

### VS Code

If you select a Google Cloud project without the Gemini for Google Cloud API enabled, you receive a notification that gives you the option to enable the API from the IDE. Select**Enable the API** in the notification window to enable the API for your project. For more information, see[Set up Gemini Code Assist Standard and Enterprise for a project](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise).

If you prefer to follow the**Code with Gemini Code Assist** walkthrough directly in your IDE, click**Launch VS Code**and follow the steps in the walkthrough to connect to Google Cloud and activate Gemini Code Assist Standard or Enterprise.

[Launch VS Code](vscode://googlecloudtools.cloudcode/cloudcode.openWalkthrough?id=duet-ai)

Otherwise, follow these steps:

1. Launch your IDE.

2. In the activity bar, click**Gemini Code Assist**.

3. In the**Gemini Code Assist** chat pane, click**Login to Google Cloud**.

4. When prompted to allow Gemini Code Assist to open the external website, click**Open**.

5. Follow the prompts to sign into your Google Account.

6. When asked if you downloaded Gemini Code Assist from Google, click**Sign In**.

   | **Note:** If your sign-in attempts keep timing out, see the[Sign-in attempts keep timing out](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise#known_issues)known issue for more information on troubleshooting.

   You're now connected to Google Cloud.

   Next, to select a Google Cloud project that has the Gemini for Google Cloud API enabled, follow these steps:
7. In the**Gemini Code Assist** status bar, click**Gemini Code Assist**.

   ![The Gemini status bar is available.](https://cloud.google.com/code/docs/vscode/images/duet-ai-status-bar-no-project-selected.png)
8. In the**Gemini Code Assist** menu, select**Select Gemini Code project**.

9. Select a Google Cloud project that has the Gemini for Google Cloud API enabled.

   Gemini Code Assist Standard or Enterprise is ready to use.

   ![The Gemini icon in status bar is set to normal.](https://cloud.google.com/code/docs/vscode/images/duet-ai-status-bar-project-selected.png)

### IntelliJ

To sign in to your Google Account, follow these steps:

1. In the activity bar, clickspark**Gemini Code Assist**.

2. Click**Log in to Google** . Alternatively, you can click**Copy link**and paste the URL into your browser.

3. On the page that opens in the web browser, select your Google Account.

4. On the screen that asks you to make sure that you downloaded this app from Google, click**Sign in**.

   Gemini Code Assist is now authorized to access your account.

   Next, if this is your first time using Gemini Code Assist Standard or Enterprise in your IDE, you must select a Google Cloud project by following these steps:
5. Return to your IDE. In the Gemini Code Assist tool window, if you agree to allow Google to enable the APIs required to use Gemini Code Assist on your behalf for your selected project, click**Select a GCP project**to continue.

6. In the**Select Google Cloud Project** dialog, search for and select your Google Cloud project, and then click**OK**.

7. Click**FINISH**.

Your Google Cloud project is selected with the Gemini Code Assist API enabled. You're ready to use Gemini Code Assist Standard or Enterprise in your IDE!

## Advanced setup tasks

The following sections describe advanced setup tasks that you can perform to customize Gemini Code Assist.

### Advanced IAM considerations

Instead of using the Google Cloud console or the gcloud to grant predefined IAM roles, you can do any of the following:

- Use[IAM REST APIs](https://cloud.google.com/iam/docs/reference/rest)or[IAM client libraries](https://cloud.google.com/iam/docs/reference/libraries)to grant roles.

  If you use these interfaces, use the fully qualified role names:
  - `roles/cloudaicompanion.user`
  - `roles/serviceusage.serviceUsageConsumer`

  For more information about granting roles, see[Manage access to projects, folders, and organizations](https://cloud.google.com/iam/docs/granting-changing-revoking-access).
- Create and grant custom roles.

  Any[custom roles](https://cloud.google.com/iam/docs/creating-custom-roles)that you create need the following permissions for you to access Gemini Code Assist Standard and Enterprise:
  - `cloudaicompanion.companions.generateChat`
  - `cloudaicompanion.companions.generateCode`
  - `cloudaicompanion.instances.completeCode`
  - `cloudaicompanion.instances.completeTask`
  - `cloudaicompanion.instances.generateCode`
  - `cloudaicompanion.instances.generateText`
  - `cloudaicompanion.instances.exportMetrics`
  - `cloudaicompanion.instances.queryEffectiveSetting`
  - `cloudaicompanion.instances.queryEffectiveSettingBindings`
  - `serviceusage.services.enable`
- Assign and manage licenses.

  Any[custom roles](https://cloud.google.com/iam/docs/creating-custom-roles)that you create need the following permissions for you to assign and manage Gemini Code Assist licenses:
  - `consumerprocurement.orders.get`
  - `consumerprocurement.orders.licensePools.*`
  - `consumerprocurement.orders.licensePools.update`
  - `consumerprocurement.orders.licensePools.get`
  - `consumerprocurement.orders.licensePools.assign`
  - `consumerprocurement.orders.licensePools.unassign`
  - `consumerprocurement.orders.licensePools.enumerateLicensedUsers`

Also note that for any of the preceding permissions to work, the Gemini for Google Cloud API needs to be enabled in the same Google Cloud project where you've assigned each permission.

### Change the Google Cloud project release channel

We release Gemini Code Assist features in different release channels, either Generally Available or Preview. When you set up Gemini Code Assist, your project is automatically set to the Generally Available release channel.

You can[change the Gemini Code Assist release channel](https://developers.google.com/gemini-code-assist/docs/configure-release-channels)to the Preview channel or back to the Generally Available channel at any time.

## What's next

- Learn more about the[types of generative AI assistance available in Gemini for Google Cloud](https://cloud.google.com/gemini/docs/overview).
- Learn[how Gemini for Google Cloud uses your data](https://developers.google.com/gemini-code-assist/docs/data-governance).
- Learn[how to access and manage Gemini Code Assist Standard and Enterprise administrator controls](https://developers.google.com/gemini-code-assist/docs/admin).
- Learn[how to configure code customization](https://developers.google.com/gemini-code-assist/docs/code-customization)for Gemini Code Assist Enterprise.
- [Configure VPC Service Controls for Gemini Code Assist Standard and Enterprise](https://developers.google.com/gemini-code-assist/docs/configure-vpc-service-controls).





This document outlines the chat features that Gemini Code Assist supports.

- [Learn how and when Gemini Code Assist Standard and Enterprise use your data](https://developers.google.com/gemini-code-assist/docs/data-governance).
- [Learn how and when Gemini Code Assist for individuals uses your data](https://developers.google.com/gemini-code-assist/resources/privacy-notice-gemini-code-assist-individuals).

To help you comply with any license requirements for your code, Gemini Code Assist provides source citations when its suggestions directly quote at length from a specific source. To learn more about how and when Gemini cites sources, see[How Gemini helps you generate code and cites sources](https://developers.google.com/gemini-code-assist/docs/works#how-when-gemini-cites-sources).

You can perform the following chat actions with Gemini Code Assist in any of the[supported IDEs](https://developers.google.com/gemini-code-assist/docs/supported-languages#supported_ides):

- [Use Gemini Code Assist to explain your code](https://developers.google.com/gemini-code-assist/docs/chat-gemini#chat)
- [Create multiple chats](https://developers.google.com/gemini-code-assist/docs/chat-gemini#create_multiple_chats)
- [Edit a prior prompt](https://developers.google.com/gemini-code-assist/docs/chat-gemini#edit_a_prior_prompt)
- [Regenerate a prompt response](https://developers.google.com/gemini-code-assist/docs/chat-gemini#regenerate_a_prompt_response)
- [Delete prompt and response pairs](https://developers.google.com/gemini-code-assist/docs/chat-gemini#delete_prompt_and_response_pairs)
- [Configure code preview pane](https://developers.google.com/gemini-code-assist/docs/chat-gemini#configure_code_preview_pane)
- [Prompt Gemini Code Assist with selected code using chat](https://developers.google.com/gemini-code-assist/docs/chat-gemini#prompt_with_selected_code_using_chat)
- [Add selected code snippets to context](https://developers.google.com/gemini-code-assist/docs/chat-gemini#add_selected_code_snippets_to_context)
- [Add terminal output to the chat context](https://developers.google.com/gemini-code-assist/docs/chat-gemini#prompt_with_selected_terminal_output_using_chat)
- [Specify files and folders in your workspace context](https://developers.google.com/gemini-code-assist/docs/chat-gemini#specify_files_and_folders_in_your_workspace_context)
- [Revert to a checkpoint in chat](https://developers.google.com/gemini-code-assist/docs/chat-gemini#revert_to_a_checkpoint_in_chat)
- [View code diffs](https://developers.google.com/gemini-code-assist/docs/chat-gemini#view_code_diffs)
- [Create custom commands](https://developers.google.com/gemini-code-assist/docs/chat-gemini#create_custom_commands)
- [Create rules](https://developers.google.com/gemini-code-assist/docs/chat-gemini#create_rules)
- [Exclude files from your context with an`.aiexclude`or`.gitignore`file](https://developers.google.com/gemini-code-assist/docs/create-aiexclude-file)
- [Use the Gemini Code Assist agent mode](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer)
- [Configure local codebase awareness](https://developers.google.com/gemini-code-assist/docs/configure-local-codebase-awareness)

## What's next

- [Set up Gemini Code Assist for individuals](https://developers.google.com/gemini-code-assist/docs/set-up-gemini),[Gemini Code Assist Standard](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise), or[Gemini Code Assist Enterprise](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise)if you haven't already.

- To begin using Gemini Code Assist chat features in your IDE, see[Chat with Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/chat-gemini).



| **Note:** If you're at a business or would like more team-level benefits, consider[Gemini Code Assist Standard or Enterprise](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise).

<br />

This document describes how you can use[Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/overview), an AI-powered collaborator in your IDE, to help you do the following in VS Code or IntelliJ and other[supported JetBrains IDEs](https://developers.google.com/gemini-code-assist/docs/supported-languages#supported_ides):

- Receive guidance to help you solve problems with your code.
- Generate code for your project.
- Manage the context of your project by specifying files and folders.
- Create custom commands and rules.

This document is intended for developers of all skill levels. It assumes you have working knowledge of VS Code or IntelliJ and other supported JetBrains IDEs. You can also use[Gemini in Android Studio](https://developer.android.com/studio/gemini/overview).
| **Note:** The behaviour of code generation, completion, and transformation are non-deterministic when used simultaneously with other plugins that either implement the same shortcuts and/or use the same platform API to process these actions.

## Before you begin

### VS Code

1. [Set up Gemini Code Assist for individuals](https://developers.google.com/gemini-code-assist/docs/set-up-gemini),[Gemini Code Assist Standard](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise), or[Gemini Code Assist Enterprise](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise)if you haven't already.

2. Before testing Gemini Code Assist capabilities in your code file, make sure your file's coding language is supported. For more information on supported coding languages, see[Supported coding languages](https://developers.google.com/gemini-code-assist/docs/supported-languages#coding-languages).

3. If you prefer to use your IDE behind a proxy, see[Network Connections in Visual Studio Code](https://code.visualstudio.com/docs/setup/network).

### IntelliJ

1. [Set up Gemini Code Assist for individuals](https://developers.google.com/gemini-code-assist/docs/set-up-gemini),[Gemini Code Assist Standard](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise), or[Gemini Code Assist Enterprise](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise)if you haven't already.

2. Before testing Gemini Code Assist capabilities in your code file, make sure your file's coding language is supported. For more information on supported coding languages, see[Supported coding languages](https://developers.google.com/gemini-code-assist/docs/supported-languages#coding-languages).

3. If you prefer to use your IDE behind a proxy, see[HTTP Proxy](https://www.jetbrains.com/help/idea/settings-http-proxy.html).

## Use the Gemini Code Assist chat to explain your code

In this section, you prompt Gemini Code Assist to provide an explanation of your existing code.  

### VS Code

To get an explanation of your code, follow these steps:

1. Open your code file.

2. In the activity bar of your IDE, clickspark**Gemini Code Assist**.

3. In the**Gemini Code Assist** pane, enter the prompt`Explain this code to
   me`and clicksend**Send**.

   Gemini Code Assist uses the code in your code file as a reference to your prompt and responds with an explanation of your code.

   To refer to a specific block of code instead of all the code in the file, you can select the block in your code file and then prompt Gemini Code Assist.

### IntelliJ

To get an explanation of your code, follow these steps:

1. In your IDE, open your code file.

2. In the Gemini Code Assist tool window, enter the prompt`Explain this code to me`and click**Submit**.

Gemini Code Assist uses the code in your code file as a reference to your prompt and responds with an explanation of your code.

If you only want an explanation of a certain part of your code, you can select certain code and then prompt Gemini Code Assist again. Gemini Code Assist will only use the selected code as a reference to its generated response.

When Gemini Code Assist provides you with code in its response, you can select the following options listed at the end of its response:

- **Insert at Cursor**: Inserts the generated code into your current file at your current cursor position.

- **Insert in New File**: Opens a new file and inserts the generated code into the new file.

  ![Gemini lists code actions at the end of a generated code response.](https://cloud.google.com/code/docs/intellij/images/gemini-code-assist-code-actions.png)

These options are available when Gemini Code Assist identifies the language used in your code block, and if this language is supported in your current IDE.

**View query history**

If you want to re-use your previous prompts, you can find them in your**Query History** in the**Gemini Code Assist** tool window by clickingschedule**Show Query History**.

![Gemini Query History in the tool window.](https://cloud.google.com/code/docs/intellij/images/gemini-code-assist-query-history.png)

### Create multiple chats

You can create multiple chats with Gemini Code Assist which contain their own context separate from other chats. Your chat history shows your first chat and the last updated timestamp. There's a limit of 20 chats. Once you reach this limit, the oldest chat is automatically deleted when you add a new chat.  

### VS Code

1. To add a new chat, clickadd**New Chat**and enter your prompt in the text field. After you enter the prompt, Gemini Code Assist creates the new chat.
2. To access your previous chat, clickhistory**Resume Previous Chat**. A list of your chats appear. Select the chat that you want to view.
3. To delete a chat thread, click**Resume Previous Chat** and then clickdelete**Delete**next to the chat that you want to delete.

### IntelliJ

1. To add a new chat, clickadd**New Chat**and enter your prompt in the text field. After you enter the prompt, Gemini Code Assist creates the new chat.
2. To access your previous chat, clickchat_bubble**Recent Chats**. A list of your chats appear. Select the chat that you want to view.
3. To delete a chat thread, click**Recent chats** and then clickdelete**Delete**next to the chat that you want to delete.

### Clear chat history

Gemini Code Assist uses the chat history for additional context when responding to your prompts. If your chat history is no longer relevant, you can[clear the chat history](https://developers.google.com/gemini-code-assist/docs/use-gemini-code-assist-chat#clear-chat-history).

## Manage your chat

You can manage your Gemini Code Assist chat settings by doing the following:

### Configure automatic scrolling

### VS Code

By default, Gemini Code Assist automatically scrolls through your chat. To disable this behavior, perform the following tasks:

1. Navigate to**Settings** \>**Extensions** \>**Gemini Code Assist**.

2. Search for the**Automatic Scrolling**setting and unselect the checkbox.

### IntelliJ

This feature isn't supported in Gemini Code Assist for IntelliJ and other JetBrains IDEs.

### Stop in-progress chat

### VS Code

You can stop an in-progress chat response by pressingstop**Stop**:

![Button to stop in-progress VS Code Gemini Code Assist chat response](https://cloud.google.com/gemini/images/vscode-stop-chat.png)

### IntelliJ

You can stop an in-progress chat response by pressingstop**Stop**:

![Button to stop in-progress IntelliJ Gemini Code Assist chat response](https://cloud.google.com/gemini/images/intellij-stop-chat.png)

### Edit a prior prompt

When you edit a prior prompt, Gemini Code Assist regenerates the response to the edited prompt. To edit your prompt, follow these steps:  

### VS Code

1. In the chat pane, hold your pointer over the prompt that you want to edit.

2. Clickedit**Edit**.

   ![Modify prompt in VS Code Gemini Code Assist.](https://cloud.google.com/gemini/images/vscode-edit-prompt.png)
3. Make changes to your prompt and click**Update**.

   Gemini Code Assist generates a new response to your edited prompt.

### IntelliJ

1. In the chat pane, hold your pointer over the prompt that you want to edit.

2. Clickedit**Edit**.

   ![Modify prompt in IntelliJ Gemini Code Assist.](https://cloud.google.com/gemini/images/intellij-edit-prompt.png)
3. Make changes to your prompt and click**Update**.

   Gemini Code Assist generates a new response to your edited prompt.

### Regenerate a prompt response

If preferred, you can regenerate a different response to your most recent prompt by following these steps:  

### VS Code

In the Gemini Code Assist Chat pane, at the bottom of your most recent response, clickreplay**Regenerate response**.

Gemini Code Assist re-evaluates your recent prompt and provides a new response.

### IntelliJ

In the Gemini Code Assist Chat pane, at the bottom of your most recent response, clickreplay**Regenerate response**.

Gemini Code Assist re-evaluates your recent prompt and provides a new response.

### Delete prompt and response pairs

To delete your prompt and Gemini Code Assist's response to that particular prompt, follow these steps:  

### VS Code

1. In the chat pane, hold your pointer over your prompt that you wish to remove.

2. Click**Delete**.

   ![Delete prompt and response pair in VS Code Gemini Code Assist.](https://cloud.google.com/gemini/images/vscode-delete-prompt-response-pair.png)
3. When prompted to confirm if you want to delete the prompt and response pair, select**Delete** . Otherwise, click**Cancel**to cancel the operation.

   Your prompt and response pair is removed from your chat history with Gemini Code Assist.

### IntelliJ

1. In the chat pane, hold your pointer over your prompt that you wish to remove.

2. Click**Delete**.

   ![Delete prompt and response pair in IntelliJ Gemini Code Assist.](https://cloud.google.com/gemini/images/intellij-delete-prompt-response-pair.png)
3. When prompted to confirm if you want to delete the prompt and response pair, select**Delete** . Otherwise, click**Cancel**to cancel the operation.

   Your prompt and response pair is removed from your chat history with Gemini Code Assist.

### Configure code preview pane

By default, the code preview pane setting for Gemini Code Assist chat is enabled. With this setting enabled, the preview code block in the Gemini Code Assist chat shows the first 6 lines of code. You can expand and collapse code blocks.

To change the default setting, perform the following tasks:  

### VS Code

1. In your IDE, navigate to**Settings** \>**Extensions** \>**Gemini Code Assist**.

2. Search for the**Default Code Block Display**setting.

3. Select one of the following options:

   - **Expanded**: Automatically expands all code blocks in Gemini Code Assist chat responses.

   - **Preview**: Only shows the first 6 lines of code in the code block. You must expand the code block in the Gemini Code Assist chat response to see the rest of the code. This is the default setting.

   - **Collapse**: Automatically collapses all code blocks in Gemini Code Assist chat responses.

   When the IDE reloads, the new setting takes effect.

### IntelliJ

This feature is the default in IntelliJ Gemini Code Assist and other JetBrains IDEs and is not configurable.

## Prompt Gemini Code Assist with selected code using chat

Gemini Code Assist can perform tasks or answer your questions based on the code that you select. To get generated code that's based on a prompt with selected code, follow these steps:  

### VS Code

1. In the activity bar, clickspark**Gemini Code Assist** to open the**Gemini Code Assist**pane.

2. In your code file, select a block of code.

3. In the**Gemini Code Assist**pane text field, enter a prompt for the selected code.

   For example, select a function in your code and enter the prompt`Write
   a unit test for this function`.

   Gemini uses your selected code as reference and responds to your prompt.

### IntelliJ

1. In the activity bar, clickspark**Gemini Code Assist** to open the**Gemini Code Assist**tool window.

2. In your code file, select a block of code.

3. In the**Gemini Code Assist**tool window text field, enter a prompt for the selected code.

   For example, select a function in your code and enter the prompt`Write a
   unit test for this function.`

   Gemini Code Assist uses your selected code as reference and responds to your prompt.

### Add selected code snippets to context

You can select, attach, and direct Gemini Code Assist to focus on code snippets. Code snippet selection enables discrete analysis of smaller code blocks instead of entire files.

When you select a code snippet in your code file, you can instruct Gemini Code Assist add the code snippet to the[Context Drawer](https://developers.google.com/gemini-code-assist/docs/chat-gemini#manage_files_and_folders_in_the_context_drawer).

Anything selected in the editor window, but not yet added to the Context Drawer, is also automatically included in the context. Selected code snippets only show up for a single chat turn. They won't persist in the Context Drawer, but remain in your Gemini Code Assist chat history.

In this section, you add a selected code snippet to your context and get an explanation about the code snippet from Gemini Code Assist:  

### VS Code

1. In your code file, select a code snippet.

2. In the Gemini Code Assist Chat text field, click**Add to Chat Context**.

   Gemini Code Assist adds the selected code snippet to your Context Drawer.
3. In the Gemini Code Assist Chat text field, enter the prompt`what does this code do?`.

   Gemini Code Assist responds to your prompt based on your selected code snippet in the Context Drawer.

### IntelliJ

1. In your code file, select a code snippet.

2. Select thesparkGemini icon and then select**Add Selected Text to Chat Context**from the menu.

   The code snippet is added to your Context Drawer.

## Prompt Gemini Code Assist with selected terminal output using chat

Gemini Code Assist can perform tasks or answer your questions based on selected terminal output. To get an explanation of selected terminal output, follow these steps:  

### VS Code

1. In your IDE, open your terminal (**View** \>**Terminal**).

2. Select any terminal output.

3. Right-click the selected terminal output and select**Gemini Code Assist: Add to Chat Context**.

   Gemini Code Assist adds your terminal output to the Context Drawer.
4. In the Gemini Code Assist Chat text field, enter the prompt`what does this do?`.

   Gemini Code Assist responds to your prompt based on your selected terminal output in the Context Drawer.

### IntelliJ

1. In the Gemini Code Assist Chat text field, enter`@terminal`.

2. In the list that appears, under**Terminals**, select the terminal that you want to enquire about.

   ![Select a terminal in IntelliJ.](https://cloud.google.com/gemini/images/intellij-select-terminal.png)
3. In the Gemini Code Assist Chat text field, enter the prompt`what does this do?`.

   Gemini Code Assist responds to your prompt based on your selected terminal output.

## Specify files and folders in your workspace context

You can specify files or folders in your workspace for Gemini Code Assist to use as context. When you specify a folder, Gemini Code Assist uses the files in the folder as well as the files in subfolders as context.
**Note:** When you include a folder, Gemini Code Assist selects up to the first 100 files it finds within the folder and its subfolders. If you require codebase awareness beyond this limit, you may want to consider use of[code customization](https://developers.google.com/gemini-code-assist/docs/code-customization).  

### VS Code

To specify files or folders in your chat prompt, type<kbd>@</kbd>and select the file or folder you want to specify.

![Specify files and folders with local codebase awareness for VS Code.](https://cloud.google.com/gemini/images/vscode-local-codebase-awareness-specify-files-folders.png)

To get an explanation on the differences of two files in your codebase, follow these steps:

1. In the activity bar, clickspark**Gemini Code Assist**.

2. In the**Gemini Code Assist** pane, enter the prompt`Explain the
   difference between @YOUR_FILE_NAME_1 and @YOUR_FILE_NAME_2`and press<kbd>Enter</kbd>(for Windows and Linux) or<kbd>Return</kbd>(for macOS), or<kbd>Tab</kbd>. You can also click the name of the file in the list to select the file. Clicking the file name adds the file to your prompt context and opens the file in your IDE.

Gemini Code Assist responds to your prompt while using the two files you specified for context. Gemini Code Assist also includes the files you specified in**Context Sources**.

Now that you've specified those files, you can continue asking additional questions or prompts in the same chat history, without having to specify the files again.

For example: In the**Gemini Code Assist** pane, enter the prompt`How can I
improve YOUR_FILE_NAME_1?`(without the<kbd>@</kbd>symbol) and press<kbd>Enter</kbd>(for Windows and Linux) or<kbd>Return</kbd>(for macOS).

Gemini Code Assist responds to your enquiry about the file you specified in your prompt.
| **Note:** If you clear your chat history, Gemini Code Assist no longer uses your files for context and you must re-specify the files in the chat pane using the<kbd>@</kbd>symbol if you want to make more enquiries about the files.

### IntelliJ

To specify files or folders in your chat prompt, type<kbd>@</kbd>and select the files or folders you want to specify.

![Specify files with local codebase awareness for IntelliJ.](https://cloud.google.com/gemini/images/intellij-local-codebase-awareness-specify-files-folders.png)

To get an explanation on the differences of two files in your codebase, follow these steps:

1. In the activity bar, clickspark**Gemini Code Assist**.

2. In the**Gemini Code Assist** pane, enter the prompt`Explain the
   difference between @YOUR_FILE_NAME_1 and @YOUR_FILE_NAME_2`and press<kbd>Enter</kbd>(for Windows and Linux) or<kbd>Return</kbd>(for macOS), or<kbd>Tab</kbd>. You can also click the name of the file in the list to select the file. Clicking the file name adds the file to your prompt context and opens the file in your IDE.

Gemini Code Assist responds to your prompt while using the two files you specified for context. Gemini Code Assist also includes the files you specified in**Context Sources**.

Now that you've specified those files, you can continue asking additional questions or prompts in the same chat history, without having to specify them again.

For example: In the**Gemini Code Assist** pane, enter the prompt`How can I
improve YOUR_FILE_NAME_1?`(without the<kbd>@</kbd>symbol) and press<kbd>Enter</kbd>(for Windows and Linux) or<kbd>Return</kbd>(for macOS).

Gemini Code Assist responds to your enquiry about the file you specified in your prompt.
| **Note:** If you clear your chat history, Gemini Code Assist no longer uses your files for context and you must re-specify the files or folders in the chat pane using the<kbd>@</kbd>symbol if you want to make more enquiries about the files.

### Manage files and folders in the Context Drawer

After you[specify a file or folder to be used as context for your Gemini Code Assist prompts](https://developers.google.com/gemini-code-assist/docs/chat-gemini#specify_files_and_folders_in_your_workspace_context), these files and folders are placed in the*Context Drawer*, where you can view and remove them from the prompt context.

To manage the files and folders in your Context Drawer, perform the following tasks:  

### VS Code

| **Note:** Chats created with Gemini Code Assist for VS Code, prior to version`2.34.0`, won't retain and display the saved context in the Context Drawer. This can lead to issues where the chat doesn't display the correct context. To build and retain context among chats, we recommend you clear chats prior to this version.

1. In the activity bar of your IDE, clickspark**Gemini Code Assist**.

2. To view the files and folders in your Context Drawer, click**Context items**.

   ![Context Drawer for Gemini Code Assist for VS Code](https://cloud.google.com/gemini/images/vscode-context-drawer.png)
3. To remove items from the Context Drawer, clickclose**Remove**.

### IntelliJ

1. In the activity bar, clickspark**Gemini Code Assist.**

2. To view the files and folders in your Context Drawer, click**Context**.

   ![Context Drawer for Gemini Code Assist for IntelliJ](https://cloud.google.com/gemini/images/intellij-context-drawer.png)
3. To remove files and folders from the Context Drawer, clickclose**Remove**.

## Exclude files from local context

By default, Gemini Code Assist excludes files from local use in the context for code completion, code generation, code transformation, and chat if the files are specified in a`.aiexclude`or`.gitignore`file.

To learn how to exclude files from local use, see[Exclude files from Gemini Code Assist use](https://developers.google.com/gemini-code-assist/docs/create-aiexclude-file).

## Revert to a checkpoint in chat

After applying the changes that Gemini Code Assist generates based on your prompt, you can choose to revert the modified code file(s) to a certain checkpoint, which reverts all of the applied changes to the code file(s).

Reverting to a checkpoint does*not*revert manual changes that you may have made to the code file(s).

To revert your code file to a checkpoint, follow these steps:  

### VS Code

In the Gemini Code Assist chat pane, clickundo**Revert to checkpoint**. This reverts your code file back to the checkpoint state before the edits were made.

### IntelliJ

If you've already clickedcheck**Accept changes** for a chat generated code suggestion, then you have the option to rollback the changes using theundo**Rollback changes**button:

In the Gemini Code Assist chat pane, clickundo**Rollback Changes**. This reverts your code file back to the checkpoint state before the edits were made.

![Revert to checkpoint button in IntelliJ Gemini Code Assist.](https://cloud.google.com/gemini/images/intellij-revert-to-checkpoint.png)

## View code diffs

By default, Gemini Code Assist suggests changes to your code with a code diff. You can trigger this diff any time you ask Gemini Code Assist to make changes to your code.

In this section, you prompt Gemini Code Assist to optimize your code file, view the diff in your code file, and accept or reject changes as preferred.  

### VS Code

1. With your code file opened, prompt Gemini Code Assist to`optimize this file`. If you want to optimize multiple files and folders, prompt Gemini Code Assist to`optimize @FILE1 and @FILE2`.

   Gemini Code Assist responds to your prompt with code change suggestions in the code file(s) along with an inline diff that illustrates these changes.
2. In the code file, clickcheck_small**Accept** orclose_small**Reject**.

   ![Accept or reject suggested a single change in a file in VS Code Gemini Code Assist.](https://cloud.google.com/gemini/images/vscode-accept-reject-diff.png)
3. If Gemini Code Assist suggests multiple changes throughout your code file(s), click**View** above the suggestion and then click**Next** or**Previous**, to cycles through the other suggestions.

4. If you want to accept or reject all of the suggested changes, click**Accept file** or**Reject file**.

   ![Accept or reject all changes in a file in VS Code Gemini Code Assist.](https://cloud.google.com/gemini/images/vscode-accept-reject-file.png)
5. You can also use the Quick Preview in the prompt response to accept or reject all suggestions across multiple code files.

   ![Quick Preview in VS Code Gemini Code Assist.](https://cloud.google.com/gemini/images/vscode-quick-preview.png)

### IntelliJ

1. With your code file opened, prompt Gemini Code Assist to`optimize this file`. If you want to optimize multiple files and folders prompt Gemini Code Assist to`optimize @FILE1 and @FILE2`.

   Gemini Code Assist responds to your prompt with code change suggestions in the code file(s) along with an inline diff that illustrates these changes.
2. In the code file, clickcheck_small**Accept** orundo**Reject**.

   ![Accept or reject suggested a single change in a file in IntelliJ Gemini Code Assist.](https://cloud.google.com/gemini/images/intellij-accept-reject-diff.png)
3. If Gemini Code Assist suggests multiple changes throughout your code file(s), clickarrow_upwardorarrow_downwardto cycle through the other suggestions.

   ![Cycle through changes in a file in IntelliJ Code Gemini Code Assist.](https://cloud.google.com/gemini/images/intellij-cycle-diffs.png)
4. You can also use the Quick Preview in the prompt response to accept or reject all suggestions across multiple code files.

   ![Quick Preview in IntelliJ Code Gemini Code Assist.](https://cloud.google.com/gemini/images/intellij-quick-preview.png)

### Change diff view settings

### VS Code

If you prefer, you can change this setting to have a separate diff view window in your IDE by following these steps:

1. In the activity bar, navigate tosettings**Settings** \>**Settings**.

2. In the**User** tab of the settings, navigate to**Extensions** \>**Gemini Code Assist**.

3. Scroll to the**Geminicodeassist \> Chat: Change View**setting.

4. In the dropdown list, select one of the following options:

   - **Inline suggestions**(enabled by default): Code changes displayed in your code file.

   - **Default diff view**: Opens a new file with side-by-side code changes.

### IntelliJ

1. In the chat response of the Gemini Code Assist sidebar Ask panel, click the**Preview in diff mode** button (compare_arrows).

   A**Side-by-side**tab appears in the main coding pane.
2. Click on the**Side-by-side**tab to view side-by-side code changes.

## Create custom commands

By default, Gemini Code Assist provides commands like`/generate`for VS Code and**Generate Code** for IntelliJ and[other supported JetBrains IDEs](https://developers.google.com/gemini-code-assist/docs/supported-languages#supported_ides). You can also create your own custom commands to help you accomplish repetitive tasks faster in your IDE.

In this section, you create a custom command called`add-comments`that adds comments to the code in your code file. For IntelliJ and other supported JetBrains IDEs, you'll create, save, and execute the custom command from the Prompt Library, and from the in-editor prompt.  

### VS Code

1. In your code file, press<kbd>Control+I</kbd>(for Windows and Linux) or<kbd>Command+I</kbd>(for macOS) to open the**Gemini Code Assist Quick Pick**menu.

2. In the menu, search for and select**Preferences: Open Settings (UI)**.

3. In the**Search settings** field, enter`Geminicodeassist: Custom
   Commands`.

4. In the**Custom Commands** box, select**Add Item**.

5. In the**Item** field, enter`add-comments`as the name of the command.

6. In the**Value** field, enter`add comments to all functions without
   comments in my code`as the prompt.

7. Click**OK**.

You can now use the custom command`add-comments`in your IDE. The command appears in the list of commands in the Gemini Code Assist Quick Pick menu (<kbd>Control+I</kbd>(for Windows and Linux) or<kbd>Command+I</kbd>(for macOS)).

### IntelliJ

1. In your IDE, navigate to**Settings** \>**Tools** \>**Gemini** \>**Prompt Library**.

   ![Prompt Library for IntelliJ Gemini Code Assist](https://cloud.google.com/gemini/images/intellij-prompt-library.png)
2. In the**Prompt Library** window, clickadd**Add**.

3. Name your custom command`add-comments`.

4. In the Prompt Library's text box, enter the prompt:`Add comments to all functions without comments in this code`.

5. Select the**Show in In-Editor Prompt**checkbox if it's unselected.

6. Click**OK**to save the custom command in the Prompt Library.

7. In your code file, highlight the code that you want to modify.

8. Right-click the highlighted code and navigate to**Gemini** \>**Prompt Library** and then select the custom command`add-comments`.

   Gemini Code Assist executes the`add-comments`command and adds comments to your highlighted code.

You can also invoke the custom command with the in-editor prompt by performing the following tasks:

1. In your code file, highlight the code that you want to modify, and press<kbd>Alt+\</kbd>(for Windows and Linux) or<kbd>Cmd+\</kbd>(for macOS) to open the**Gemini Code Assist Quick Pick**menu.

2. In the menu, select your custom command`add-comments`.

   Gemini Code Assist executes the`add-comments`command and adds comments to your highlighted code.

In the Gemini Code Assist chat pane, you can type<kbd>@</kbd>to retrieve and use a saved prompt in your Prompt Library.

## Create rules

You can create rules for Gemini Code Assist to follow, and the rules are included in every chat prompt you enter.

Rules in Gemini let you define your preferences, such as:

- Coding style
- Output formats
- Tech stack
- Language

For example, you can create a rule such as "Always give me concise responses in Kotlin."  

### VS Code

1. In your code file, press<kbd>Control+I</kbd>(for Windows and Linux) or<kbd>Command+I</kbd>(for macOS) to open the**Gemini Code Assist Quick Pick**menu.

2. In the menu, search for and select**Preferences: Open Settings (UI)**.

3. In the**Search settings** field, enter`Geminicodeassist: Rules`.

4. In the text field, enter a rule such as:`Always generate unit tests when
   creating a new function`. You can also add one or more rules with multiple lines in the text field.

   After adding rules in the Rules settings, Gemini Code Assist considers the rule for every prompt or request you make.

   To remove the rule, delete the content from the Rules text field.

### IntelliJ

| **Note:** Rules aren't used in agent mode.

1. To create a rule, go to**Settings \> Tools \> Gemini \> Prompt Library \> Rules**and then edit the text in the editor.
2. To set the scope of the rule, in the**Scope** drop-down, select**IDE** or**Project**.

   - IDE-level rules are private to yourself and can be used across multiple projects.
   - Project-level rules can be shared among teammates working on the same project.

   To share prompts across the team you must add the`.idea`folder to the version control system.

<br />

![Create Gemini rules in IntelliJ](https://developers.google.com/static/gemini-code-assist/images/intellij-rules.png)

<br />

## Known issues

This section outlines the known issues of Gemini Code Assist:  

### VS Code

- **Chat responses may be truncated when they include an updated version of a large open file**

  To work around this issue, select a smaller section of code and include an additional directive in the chat prompt, such as`only output the selected
  code.`
- **Vim: Cannot accept or dismiss code generation suggestions unless in insert mode**

  When using the Vim plugin in normal mode, you can't accept or dismiss code suggestions.

  To work around this issue, press<kbd>i</kbd>to enter insert mode, and then press<kbd>Tab</kbd>to accept the suggestion.
- **Vim: Inconsistent behavior when pressing<kbd>Esc</kbd>to dismiss suggestions**

  When you press<kbd>Esc</kbd>, both the IDE and Gemini Code Assist suggestions are dismissed. This behavior is different from the non-Vim behavior where pressing<kbd>Esc</kbd>re-triggers Gemini Code Assist.
- **Sign-in attempts keep timing out**

  If your sign-in attempts keep timing out, try adding the`cloudcode.beta.forceOobLogin`setting to your`settings.json`file:  

       "cloudcode.beta.forceOobLogin": true

- **License recitation warnings don't persist across sessions**

  If license recitation warnings don't persist across sessions, refer to the persistent logs:
  1. Click**View** \>**Output**.

  2. Select**Gemini Code Assist - Citations**.

- **Connectivity issues in the Gemini Code Assist output window**

  If you see a connection error or other connectivity problems in the Gemini Code Assist output window, try the following:
  - Configure your firewall to allow access to`oauth2.googleapis.com`and`cloudaicompanion.googleapis.com`.

  - Configure your firewall to allow communication over HTTP/2, which gRPC uses.

  You can use the`grpc-health-probe`tool to test connectivity. A successful check results in the following output:

  `$ grpc-health-probe -addr cloudaicompanion.googleapis.com:443 -tls
  error: this server does not implement the grpc health protocol
  (grpc.health.v1.Health): GRPC target method can't be resolved`

  An unsuccessful check results in the following output:

  `timeout: failed to connect service "cloudaicompanion.googleapis.com:443" within 1s`

  To obtain more details, run the following before`grpc-health-probe`:  

      export GRPC_GO_LOG_SEVERITY_LEVEL=info

### IntelliJ

There are no known issues for Gemini Code Assist for IntelliJ and other supported JetBrains IDEs.

## Leave feedback

To leave feedback of your experience, see[Provide Gemini for Google Cloud feedback](https://developers.google.com/gemini-code-assist/docs/feedback).

## What's next

- Learn[how Gemini for Google Cloud uses your data](https://developers.google.com/gemini-code-assist/docs/data-governance).
- Learn about[Gemini Code Assist Standard and Enterprise pricing](https://cloud.google.com/products/gemini/pricing).





| **Preview**
|
| <br />
|
| This product or feature is in preview. Products and features that are in preview are available "as is".
|
| <br />
|
<br />

This document describes agent mode in Gemini Code Assist.

Agent mode is available in the VS Code and IntelliJ integrated development environments (IDEs). To start using agent mode, see[Use the Gemini Code Assist agent mode](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer).

Agent mode in VS Code is powered by[Gemini CLI](https://developers.google.com/gemini-code-assist/docs/gemini-cli).

Agent mode in IntelliJ doesn't use the Gemini CLI.

With agent mode, you can do any of the following and more:

- Ask questions about your code.
- Use context and built-in tools to improve generated content.
- [Configure MCP servers](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer#configure-mcp-servers)to extend the agent's abilities.
- Get solutions to complex tasks with multiple steps.
- Generate code from design documents, issues, and`TODO`comments.
- Control the agent behavior by commenting on, editing, and approving plans and tool use during execution.

## How agent mode works

In agent mode, your prompt is sent to the Gemini API with a list of[tools](https://developers.google.com/gemini-code-assist/docs/agent-mode#tools)that are available. The Gemini API processes the prompt and returns a response. The response might be a direct answer or a request to use an available tool.

When a tool is requested, the agent prepares to use the tool and checks to see if it is allowed to use the tool with or without explicit permission:

- For tool requests that modify the file system, or perform mutating operations on any resources, Gemini will ask you to allow the operation unless you have configured Gemini to always allow the tool or tools.
- Tool requests that are read-only might not ask for permission before completing the task.

When asked to allow the use of a tool, you can choose to allow or deny the operation. The agent might also give you options to always allow a tool or server or allow similar operations. For more information, see[Always allow agent actions](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer#yolo-mode).

Once permission to use the tool is given or self-granted, the agent uses the tool to complete the required action, and the result of that action is sent back to the Gemini API. Gemini processes the result of the tool action and generates another response. This cycle of action and evaluation continues until the task is complete.

For complex tasks, Gemini might show a high-level plan for your approval. You can fine tune the plan and ask questions in chat before beginning the process. Once you are happy with the plan, you can approve it. After you approve the plan, the agent starts working on the first task, and will ask you for clarifications or permissions as needed as it executes the plan.

## Agent mode context

Context allows an agent to generate better responses for a given prompt. Context can be taken from files in your IDE, files in your local system folders, tool responses, and your prompt details.

Depending on your IDE and settings, different contexts might be available to the agent.

The following tabs detail how context is gathered for different IDEs.  

### VS Code

The following methods of getting context are usually available to Gemini Code Assist in agent mode:

- Information in your IDE workspace.
- Tool responses from built-in tools like grep, terminal, file read, or file write.
- Google Search responses.
- Content from a given URL provided in a prompt or by a tool.
- Context files you create in Markdown.

### IntelliJ

The following methods of getting context are usually available to Gemini Code Assist in agent mode:

- Information in your IDE project including your files, indexed symbols and usage of symbols in your project.
- Tool responses from built-in tools like grep, file read, or file write.
- IntelliJ[version control](https://www.jetbrains.com/help/idea/version-control-integration.html).
- Configured MCP servers and tools
- Context files you create in Markdown.

You can see the context available to the agent in the context drawer in the agent mode chat prompt area.  
![Agent mode context drawer.](https://developers.google.com/static/gemini-code-assist/images/intellij-agent-mode-welcome-context-drawer.png)

## Tools

*Tools*are a broad category of services that an agent can use for context and actions in its response to your prompt. Tools allow agents to access up-to-date information through function calling to API endpoints or to other agents. Tools might only offer one function, or they might offer multiple related functions.

Some example tools are built-in tools like grep and file read or write, local or remote Model Context Protocol (MCP) servers and their executable functions, and RESTful API calls.

### Built-in tools

In agent mode, Gemini has access to your built-in system tools. Select your IDE to view a list of built-in tools available to Gemini in agent mode.  

### VS Code

All of the[Gemini CLI built-in tools](https://github.com/google-gemini/gemini-cli/blob/main/docs/core/tools-api.md#built-in-tools)are available to agent mode in Gemini Code Assist.

### IntelliJ

`read_file`
:   Retrieves the text content of a file using its absolute path.

`write_file`
:   Writes the given text to a specified file, creating the file if it doesn't exist.

`analyze_current_file`
:   Analyzes the open file in the editor for errors and warnings.

`find_files`
:   Finds the absolute path to files given a filename or a part of the path

`grep`
:   Finds all files inside the project that contain a given text pattern or regular expression.

`list_files`
:   Lists all files and directories in a given absolute path.

`resolve_symbol`
:   Resolves a specific symbol reference to its original declaration.

`find_usages`
:   Searches the project for all references to a given symbol declaration.

`git`
:   Runs a Git command-line interface (CLI) command and returns the result.

`list_vcs_roots`
:   Returns all Version Control System (VCS) roots, such as Git repositories, in the current project.

## Limitations

Some features of[standard Gemini Code Assist chat](https://developers.google.com/gemini-code-assist/docs/chat-overview)might not be available in agent mode or might work differently than they do in standard chat.

Recitation is not available in agent mode. While in agent mode, Gemini doesn't[cite sources](https://developers.google.com/gemini-code-assist/docs/works#how-when-gemini-cites-sources)and you can't[disable code suggestions that match cited sources](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#disable_code_suggestions_that_match_cited_sources).

## What's next

- [Use the Gemini Code Assist agent mode](https://developers.google.com/gemini-code-assist/docs/use-agentic-chat-pair-programmer).
- Read the[Gemini CLI documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/index.md).








| **Preview**
|
| This product or feature is in preview. Products and features that are in preview are available "as is".

<br />

This document describes how to configure and use Gemini Code Assist agent mode as a pair programmer in your integrated development environment (IDE).

With agent mode, you can do any of the following and more:

- Ask questions about your code.
- Use context and built-in tools to improve generated content.
- Configure MCP servers to extend the agent's abilities.
- Get solutions to complex tasks with multiple steps.
- Generate code from design documents, issues, and`TODO`comments.
- Control the agent behavior by commenting on, editing, and approving plans and tool use during execution.

## Limitations

Some features of[standard Gemini Code Assist chat](https://developers.google.com/gemini-code-assist/docs/chat-overview)might not be available in agent mode or might work differently than they do in standard chat.

Recitation is not available in agent mode. While in agent mode, Gemini doesn't[cite sources](https://developers.google.com/gemini/docs/discover/works#how-when-gemini-cites-sources)and you can't[disable code suggestions that match cited sources](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#disable_code_suggestions_that_match_cited_sources).

## Before you begin

### VS Code

<br />

1. Set up the edition of Gemini Code Assist you want to use in your IDE:
   - [Gemini Code Assist for individuals](https://developers.google.com/gemini-code-assist/docs/set-up-gemini)
   - [Gemini Code Assist Standard or Enterprise](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise)

<br />

### IntelliJ

Set up the edition of Gemini Code Assist you want to use in your IDE:

- [Gemini Code Assist for individuals](https://developers.google.com/gemini-code-assist/docs/set-up-gemini)
- [Gemini Code Assist Standard or Enterprise](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise)

<br />

## Use agent mode

In agent mode, you can ask Gemini to complete high-level goals and complex tasks.

To get the most out of agent mode, follow[prompting best practices](https://cloud.google.com/gemini/docs/discover/write-prompts)and provide as much detail as possible.
| **Caution:** There isn't an option to undo changes made to resources outside your IDE in agent mode, so be careful where you use it.

To switch to agent mode:  

### VS Code

1. To open the Gemini Code Assist chat, in the activity bar of your IDE, clickspark**Gemini Code Assist**.
2. Click the**Agent**toggle to enter agent mode. The toggle is highlighted when toggled to agent mode and grey when in regular chat.
3. In the Gemini Code Assist chat, enter your prompt.

Gemini gives you a response to your prompt, or requests permission to use a tool.

To stop the agent, clickstop**Stop**.

To use the standard Gemini Code Assist chat, clickadd**New chat**to create a new chat.

Gemini Code Assist agent mode is powered by the[Gemini CLI](https://developers.google.com/gemini-code-assist/docs/gemini-cli).

### IntelliJ

1. Clickspark**Gemini**in the tool window bar. Sign in if prompted to do so.
2. Select the**Agent**tab.
3. Describe the task you want the agent to perform.
4. As the agent goes through the steps to accomplish the task, you'll have the option to review and approve any changes.

5. Optional: To automatically approve changes, selectsettings**Agent options** and click the checkbox next to**Auto-approve changes**.

   | **Caution:** The agent has access to your machine's file system and terminal actions as well as any tools you've configured for use. Be extremely careful where and when you auto-approve changes.

## Configure tools for agent mode

*Tools*are a broad category of services that an agent can use for context and actions in its response to your prompt. Some example tools are built-in tools like grep and file read or write, local or remote Model Context Protocol (MCP) servers and their executable functions, or bespoke service implementations.

### Control built-in tool use

Agent mode has access to your built-in tools like file search, file read, file write, terminal commands, and more.  

### VS Code

You can use the`coreTools`and`excludeTools`settings to control which tools Gemini has access to in agent mode.

`coreTools`
:   Lets you specify a list of tools that you want to be available to the model. You can also specify command-specific restrictions for tools that support it. For example---adding the following to your Gemini settings JSON will only allow the shell`ls -l`command to be executed:`"coreTools": ["ShellTool(ls -l)"]`.

`excludeTools`
:   Lets you specify a list of tools that you don't want to be available to the model. You can also specify command-specific restrictions for tools that support it. For example---adding the following to your Gemini settings JSON will block the use of the`rm -rf`command:`"excludeTools": ["ShellTool(rm -rf)"]`.

A tool listed in both`excludeTools`and`coreTools`is excluded.

To configure the built-in tools available in agent mode, do the following:

1. Open your Gemini settings JSON located in`~/.gemini/settings.json`where`~`is your home directory.
2. To restrict agent tool use to a list of approved tools, add the following line to your Gemini settings JSON:

   <br />

       "coreTools": ["<var translate="no">TOOL_NAME_1</var>,<var translate="no">TOOL_NAME_2</var>"]

   <br />

   Replace<var translate="no"><code translate="no" dir="ltr">TOOL_NAME_1</code></var>and<var translate="no"><code translate="no" dir="ltr">TOOL_NAME_2</code></var>with the names of the[built-in tools](https://github.com/google-gemini/gemini-cli/blob/main/docs/core/tools-api.md#built-in-tools)you want the agent to have access to.

   You can list as many built-in tools as you want. By default all built-in tools are available to the agent.
3. To restrict agent tool use to specific tool commands, add the following line to your Gemini settings JSON:

   <br />

       "coreTools": ["<var translate="no">TOOL_NAME</var>(<var translate="no">COMMAND</var>)"]

   <br />

   Replace the following:
   - <var translate="no"><code translate="no" dir="ltr">TOOL_NAME</code></var>: the name of the built-in tool
   - <var translate="no"><code translate="no" dir="ltr">COMMAND</code></var>: the name of the built-in tool command you want the agent to be able to use.
4. To exclude a tool from agent use, add the following line to your Gemini settings JSON:

   <br />

       "excludeTools": ["<var translate="no">TOOL_NAME_1</var>,<var translate="no">TOOL_NAME_2</var>"]

   <br />

   Replace<var translate="no"><code translate="no" dir="ltr">TOOL_NAME_1</code></var>and<var translate="no"><code translate="no" dir="ltr">TOOL_NAME_2</code></var>with the names of the[built-in tools](https://github.com/google-gemini/gemini-cli/blob/main/docs/core/tools-api.md#built-in-tools)you want to exclude from agent use.
5. To exclude a tool command from agent use, add the following line to your Gemini settings JSON:

   <br />

       "excludeTools": ["<var translate="no">TOOL_NAME</var>(<var translate="no">COMMAND</var>)"]

   <br />

   Replace the following:
   - <var translate="no"><code translate="no" dir="ltr">TOOL_NAME</code></var>: the name of the built-in tool
   - <var translate="no"><code translate="no" dir="ltr">COMMAND</code></var>: the name of the built-in tool command you want to exclude from agent use.

For more information about the`coreTools`and`excludeTools`configuration settings, see the[Gemini CLI configuration documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/get-started/configuration.md).

### IntelliJ

This feature isn't supported in Gemini Code Assist for IntelliJ or other JetBrains IDEs.

### Configure MCP servers

| **Caution:** MCP servers can run arbitrary code with the permissions available to your user account. Make sure you trust the source of any MCP servers you use.

The following instructions show how to make MCP servers available for use in agent mode in your IDE. After you make an MCP server available, Gemini Code Assist automatically decides when and how to use the server tools contained within that MCP server.  

### VS Code

To make MCP servers available for use in agent mode, add the configuration for each server in your Gemini settings JSON file, according each server's documentation.
| **Note:** You can't use the command palette to install MCP servers for agent mode. You must add MCP servers to your Gemini settings JSON file.

1. Install any dependencies required by the MCP servers you are adding.
2. Open your Gemini settings JSON file, located at`~/.gemini/settings.json`where`~`is your home directory.
3. Configure each local or remote MCP server in the Gemini settings JSON file, according to each server's instructions.

   The following example Gemini settings JSON file configures two remote Cloudflare MCP servers, a remote GitLab MCP server, and a local GitHub MCP server for use with Gemini Code Assist in VS Code.

   <br />

       {
         "mcpServers": {
           "github": {
             "command": "npx",
             "args": ["-y", "@modelcontextprotocol/server-github"],
             "env": {
               "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_example_personal_access_token12345"
             }
           },
           "gitlab": {
             "command": "npx",
             "args": ["mcp-remote", "https://your-gitlab-instance.com/api/v4/mcp"]
           },
           "cloudflare-observability": {
             "command": "npx",
             "args": ["mcp-remote", "https://observability.mcp.cloudflare.com/sse"]
           },
           "cloudflare-bindings": {
             "command": "npx",
             "args": ["mcp-remote", "https://bindings.mcp.cloudflare.com/sse"]
           }
         }
       }

   <br />

4. Open the command palette and select**Developer: Reload Window**.

Your configured MCP servers are available for the agent to use in agent mode.

### IntelliJ

To make MCP servers available for use in agent mode, add the configuration for each server in a`mcp.json`file and place the`mcp.json`file in the[configuration directory](https://intellij-support.jetbrains.com/hc/en-us/articles/206544519-Directories-used-by-the-IDE-to-store-settings-caches-plugins-and-logs)for your IDE.

1. Install any dependencies required by the MCP servers you are adding.
2. Create a file named`mcp.json`in your IDE's[configuration directory](https://intellij-support.jetbrains.com/hc/en-us/articles/206544519-Directories-used-by-the-IDE-to-store-settings-caches-plugins-and-logs).
3. Configure each local or remote MCP server in the`mcp.json`file, according to each server's instructions.

   The following example`mcp.json`file configures two remote Cloudflare MCP servers, a remote GitLab MCP server, and a local GitHub MCP server for use with Gemini Code Assist in IntelliJ.

   <br />

       {
         "mcpServers": {
           "github": {
             "command": "npx",
             "args": ["-y", "@modelcontextprotocol/server-github"],
             "env": {
               "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_example_personal_access_token12345"
             }
           },
           "gitlab": {
             "command": "npx",
             "args": ["mcp-remote", "https://your-gitlab-instance.com/api/v4/mcp"]
           },
           "cloudflare-observability": {
             "command": "npx",
             "args": ["mcp-remote", "https://observability.mcp.cloudflare.com/sse"]
           },
           "cloudflare-bindings": {
             "command": "npx",
             "args": ["mcp-remote", "https://bindings.mcp.cloudflare.com/sse"]
           }
         }
       }

   <br />

Your configured MCP servers are available for the agent to use in agent mode.

#### MCP server authentication

Some MCP servers require authentication. Follow the server documentation to create any required user tokens, and then specify them appropriately. Typically, you specify authentication tokens for local servers using the appropriate server-specific environment variable, and you specify authentication tokens for remote servers using the HTTP`Authorization`header.  

### VS Code

For MCP servers that require authentication, you can add them to your Gemini settings JSON.

The following example shows how to specify a personal access token for the GitHub local and remote MCP servers:

<br />

    {
      "mcpServers": {
        "github-remote": {
          "httpUrl": "https://api.githubcopilot.com/mcp/",
          "headers": {
            "Authorization": "Bearer <var translate="no">ACCESS_TOKEN</var>"
          }
        },
        "github-local": {
          "command": "/Users/username/code/github-mcp-server/cmd/github-mcp-server/github-mcp-server",
          "args": ["stdio"],
          "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN": "<var translate="no">ACCESS_TOKEN</var>"
          }
        }
      }
    }

<br />

Where<var translate="no"><code translate="no" dir="ltr">ACCESS_TOKEN</code></var>is the user's access token.

### IntelliJ

For MCP servers that require authentication, you can add them to your`mcp.json`file.

The following example adds a personal access token for the GitHub local server:

<br />

    {
      "mcpServers": {
        "github-local": {
          "command": "/Users/username/code/github-mcp-server/cmd/github-mcp-server/github-mcp-server",
          "args": ["stdio"],
          "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN": "<var translate="no">ACCESS_TOKEN</var>"
          }
        }
      }
    }

<br />

Where<var translate="no"><code translate="no" dir="ltr">ACCESS_TOKEN</code></var>is the user's access token.

### Create a context file

Context allows an agent to generate better responses for a given prompt. Context can be taken from files in your IDE, files in your local system folders, tool responses, and your prompt details. For more information, see[Agent mode context](https://developers.google.com/gemini-code-assist/docs/agent-mode#agent-mode-context).  

### VS Code

1. Create a file named`GEMINI.md`in a location that matches the scope you want the context to apply to. The following table details the locations for context files for different scopes:

   |                           Scope                           |                                                               Location                                                                |
   |-----------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
   | All your projects                                         | `~/.gemini/GEMINI.md`                                                                                                                 |
   | A specific project                                        | Your working directory or any parent directories up to either your project root (identified by a`.git`folder) or your home directory. |
   | A specific component, module, or sub-section of a project | Subdirectories of your working directory.                                                                                             |

   The agent's memory system is created by loading context files from multiple locations. Context from more specific files, like those for specific components or modules, overrides or supplements content from more general context files like the global context file at`~/.gemini/GEMINI.md`.
2. Write any rules, style guide information, or context that you want the agent to use in Markdown and save the file. For more information, see the[example context file on GitHub](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/configuration.md#example-context-file-content-eg-geminimd).

The agent includes the information in your context file along with any prompts you send to it.

### IntelliJ

1. Create a file named either`GEMINI.md`or`AGENT.md`at the root of your project.

2. Write any rules, style guide information, or context that you want the agent to use in Markdown and save the file.

The agent includes the information in your context file along with any prompts you send to it. You can also add context by including a file manually with the`@`<var translate="no"><code translate="no" dir="ltr">FILENAME</code></var>syntax where<var translate="no"><code translate="no" dir="ltr">FILENAME</code></var>is the name of the file with contextual information you want to include.

## Use commands

Slash`/`commands let you quickly run commands similar to commands in a terminal window.  

### VS Code

You can use the following built-in Gemini CLI commands in agent mode:

- `/tools`: Displays a list of tools that are available in your agent mode session.
- `/mcp`: Lists configured Model Context Protocol (MCP) servers, their connection status, server details, and available tools.

<br />

For more information on Gemini CLI commands, see[Gemini CLI Commands](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/commands.md)and[Gemini custom commands](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/commands.md#custom-commands). Note that not all Gemini CLI commands are available in agent mode.

### IntelliJ

This feature isn't supported in Gemini Code Assist for IntelliJ or other JetBrains IDEs.

## Always allow agent actions

You can automatically allow all agent actions.
| **Warning:** The agent has access to your machine's file system and terminal actions as well as any tools you've configured for use. Be extremely careful where and when you automatically allow agent actions.

To automatically allow all agent actions:  

### VS Code

Use yolo mode to automatically allow all agent actions. Yolo mode can only be used in a[trusted workspace](https://code.visualstudio.com/api/extension-guides/workspace-trust).

To configure yolo mode:

1. Open your VS Code user settings JSON file:

   1. Open the**Command palette** (`ctrl`/`command`+`Shift`+`P`).
   2. Select**Preferences: Open User Settings (JSON)**.
2. Add the following to your VS Code user settings JSON file:

       //other settings...

       "geminicodeassist.agentYoloMode": true,
       //other settings...

3. Open the command palette and select**Developer: Reload Window**.

Agent mode uses yolo mode, and won't ask for permission before taking actions when you send it a prompt. When using a[restricted workspace](https://code.visualstudio.com/docs/editing/workspaces/workspace-trust#_restricted-mode)the agent will prompt before taking actions regardless of this setting.

### IntelliJ

To automatically approve changes, in the Gemini chat agent tab, selectsettings**Agent options** and then click the checkbox next to**Auto-approve changes**.

Agent mode automatically approves all requests, and won't ask for permission before taking actions when you send it a prompt.

## Additional prompts

Try out the following prompts with your own information:

- "What does this repository do? Help me understand the architecture."
- "What does this \[class/function\] do?"
- "Add a feature to this codebase - "\[link-or-path-to-codebase\]"."
- "Refactor function \[A\] and \[B\] to use the common method \[C\]."
- "Fix the GitHub issue \[link-to-github-issue\]."
- "Build an application to do \[goal\] with a UI that lets the user do \[task\] in the \[environment\]."
- "Migrate library versions in this repository from \[X\] to \[Y\]."
- "Optimize performance of this Go code so that it runs faster."
- "Use \[name-of-API\] to build out this feature."
- "Implement an algorithm to do \[x\], \[Y\], and \[Z\]."

## Optional: Use an API Key

Gemini Code Assist includes different daily[quotas](https://developers.google.com/gemini-code-assist/resources/quotas#quotas-for-agent-mode-gemini-cli)for agentic features, depending on the tier you're in. If you've exhausted your daily capacity for Gemini Code Assist agent mode, you can continue to use the service by providing an API key. You can use either a[Gemini API key](https://ai.google.dev/gemini-api/docs/api-key)or a[Vertex AI API key](https://cloud.google.com/vertex-ai/generative-ai/docs/start/api-keys).

To add your API key:

1. Navigate to your IDE's settings.

2. Open the`settings.json`file.

3. Add the following line, replacing<var translate="no">YOUR_KEY</var>with your API key:

   `"geminicodeassist.geminiApiKey": "`<var translate="no">YOUR_KEY</var>`"`

## What's next

- Read the[Gemini Code Assist overview](https://developers.google.com/gemini-code-assist/docs/overview).
- Explore some[example MCP servers](https://modelcontextprotocol.io/examples).
- Find more[MCP servers on GitHub](https://github.com/modelcontextprotocol/servers).
- [Send feedback from your IDE](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#leave_feedback).







| **Note:** Gemini Code Assist code customization is available only in Gemini Code Assist Enterprise. For more information, see[Gemini Code Assist supported features](https://developers.google.com/gemini-code-assist/docs/overview#supported-features).

Code customization, a feature in[Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/overview)Enterprise, lets you get code suggestions from Gemini Code Assist Enterprise that are based on your organization's private repositories, and thus aligned to your organization's coding style.

With code customization, developers can use remote context from your organization directly in the IDE, as the following diagram shows:

![Code customization connects Gemini Code Assist to your code repository, which lets Gemini Code Assist offer coding suggestions in your IDE.](https://cloud.google.com/gemini/images/code-customization-diagram.png)

As you code, Gemini Code Assist searches your private index for code that is similar to what you're trying to write. It then includes relevant matches in the code prompt and sends these matches to the Gemini Code Assist recommendations service. Code customization keeps recommendations fresh by reindexing your codebase every 24 hours to ensure that code suggestions remain up to date. Gemini Code Assist returns the generated code to you.

Unlike the full codebase awareness feature, which is limited to searching files in the current folder and open tabs in your IDE, code customization searches all repositories in your index. After code customization is set up, it works as part of the code completion and code generation features.

Both Gemini Code Assist and code customization are managed services. You license usage by seats per month.

## Securing access and storage of private code

Google provides security of your stored private code in several ways:

- We index and store your code in a dedicated single-tenant environment.
- [Administrative access controls](https://cloud.google.com/assured-workloads/cloud-provider-access-management/docs/administrative-access)help prevent Google employees from accessing your content without justification and, optionally, explicit approval.
- The Gemini model doesn't train on your private source code.
- Your results are private to you, and we don't share your results with other customers.

For further details on Google's security measures, see the[Google security overview](https://cloud.google.com/security/overview/whitepaper).

Here's how you can control access to your data:

- You can use Identity and Access Management permissions to help control individuals who can get code suggestions from your codebase.
- You can[create an`.aiexclude`file](https://developers.google.com/gemini-code-assist/docs/code-customization#optional_choose_which_files_are_not_indexed)to choose specific repositories or parts of repositories that Gemini Code Assist indexes.

To configure code customization in your IDE, see[Configure Gemini Code Assist code customization](https://developers.google.com/gemini-code-assist/docs/code-customization).

## Limitations

- Google limits the number of code repository indexes to one for each project and for each organization.
- The maximum number of repositories that can be indexed is 20,000.
- The maximum number of repository groups per code repository index is 500.
- The maximum number of repositories per repository group is 500.
- Code customization is supported in the VS Code Gemini Code Assist extension (version 2.18.0+), the IntelliJ Gemini Code Assist plugin (version 1.1.0), Cloud Workstations, and the Cloud Shell Editor.
- Code customization supports repositories hosted on github.com, gitlab.com, bitbucket.org, and on-premises repositories hosted on GitLab Enterprise, GitHub Enterprise, and Bitbucket Data Center.
- Code customization doesn't support[GitHub Enterprise Cloud IP restrictions](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-allowed-ip-addresses-for-your-organization).
- Code customization supports only Developer Connect connections in the following locations (regions):
  - `us-central1`
  - `europe-west1`
  - `asia-southeast1`
- Code customization doesn't index media. Code customization supports only documentation (in Markdown) and the following languages:

  - C, C++, and C#
  - Golang
  - Java
  - JavaScript
  - Kotlin
  - PHP
  - Python
  - Rust
  - TypeScript

  All other coding languages are not indexed or used in code customization. To request support for a coding language, click**Send feedback** on this page, and then select**Product feedback**.

## What's next

1. [Configure Gemini Code Assist code customization](https://developers.google.com/gemini-code-assist/docs/code-customization).

2. Once you've configured code customization in your IDE, see[Use code customization](https://developers.google.com/gemini-code-assist/docs/use-code-customization).





| **Note:** Gemini Code Assist code customization is available only in Gemini Code Assist Enterprise. For more information, see[Gemini Code Assist supported features](https://developers.google.com/gemini-code-assist/docs/overview#supported-features).

This document describes how to set up[Gemini Code Assist code customization](https://developers.google.com/gemini-code-assist/docs/code-customization-overview)in the Google Cloud console, with the Google Cloud CLI, or with Terraform by connecting Gemini Code Assist to your private code repositories. Gemini Code Assist code customization feature lets you receive code recommendations, which draw from the internal libraries, private APIs, and coding style of your organization.

## Before you begin

1. [Set up Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise)with an[Enterprise subscription](https://developers.google.com/gemini-code-assist/docs/overview#supported-features).
2. Verify that you have the following Identity and Access Management roles on the project that owns the subscription:

   - Code Repository Indexes Admin (`roles/cloudaicompanion.codeRepositoryIndexesAdmin`)
   - Gemini for Google Cloud User (`roles/cloudaicompanion.user`)
3. Create or configure user accounts. Every developer in your organization who is using Gemini Code Assist must have a user identity in Google Cloud that has permission to access your Google Cloud project. For more information, see[Grant roles in the Google Cloud console](https://cloud.google.com/iam/docs/grant-role-console). Verify each user has the following roles:

   - [Gemini for Google Cloud User](https://cloud.google.com/iam/docs/roles-permissions/cloudaicompanion#cloudaicompanion.user)
   - [Repository Groups User](https://cloud.google.com/iam/docs/roles-permissions/cloudaicompanion#cloudaicompanion.repositoryGroupsUser)
4. The code customization feature uses Developer Connect to access and index your private repositories. Ensure that the Developer Connect region where your Developer Connect repository connection is located is also a supported location for code customization. The code customization feature cannot be used if the Developer Connect connection is in an unsupported region. For the list of supported regions, see[code customization limitations](https://developers.google.com/gemini-code-assist/docs/code-customization-overview#limitations).

## Choose which repositories are indexed

As a best practice, you should index repositories that have the following characteristics:

- Code that's of a similar style or structure to what you want your developers to write.
- Private libraries or APIs that you would like to call from your current codebase.

## Optional: Choose which files are not indexed

By default, code customization indexes all the[supported code files](https://developers.google.com/gemini-code-assist/docs/code-customization-overview#limitations)in your specified repositories.

To prevent exposure of code that you don't want to index, you can use branch patterns to[control access to your index](https://developers.google.com/gemini-code-assist/docs/code-customization#control_access_to_your_index_using_repository_groups)and use a stable branch, such as`main`.

Alternatively, you can also exclude files from the index by[creating an`.aiexclude`file](https://developers.google.com/gemini-code-assist/docs/create-aiexclude-file).

## Configure Gemini Code Assist code customization

Select one of the following options:  

### Console

1. In the Google Cloud console, go to the**Code Customization**page.

   [Go to Code customization for Gemini Code Assist](https://console.cloud.google.com/gemini-code-assist/code-customization?e=CodeAssistCodeCustomizationLaunch::CodeAssistCodeCustomizationEnabled&invt=Ab537g&mods=logs_tg_staging)

   The**Code customization for Gemini Code Assist**page loads.
2. Create an index. Code customization relies on an index to analyze and parse your repository for quicker code generation suggestions and lookups.

   1. Click**Create**and configure the index details:

      - Select the region that is configured in Developer Connect in your Cloud project.
      - Enter a name for your index. Note your index name. You need it for several steps in this document.
   2. Click**Create**.

   Index creation generally takes 30 minutes to complete, but it might take up to an hour. When indexing completes, you receive a notification in the Google Cloud console.

   Google limits the number of code repository indexes to one for each project and organization.
3. Control access to your index using repository groups.

   A repository group is a container for the indexing configuration, which includes repositories and their branch patterns. Repository groups are designed for granular IAM control, giving developers access to the indexed data from those groups, where they have the`cloudaicompanion.repositoryGroups.use`permission.

   Repository groups contain Developer Connect repositories, or links, from the same project and location.
4. On the**Code customization for Gemini Code Assist** page, click**Add repositories** , and then select**Add source repositories**.

   A list displays of existing repositories in Developer Connect for the region you configured in the previous step to create the index.

   If you need to add new repositories to the repository group, then click**Link repository**and follow the steps in the Google Cloud console.

   Additionally, you can select and then edit one or more repositories to add a new branch.
5. Select the repository group to which you want to add new repositories. Alternatively, click**Create a new repository group**to create and configure a new repository group.

6. To begin indexing the selected repositories, click**Index**.

   Indexing time varies depending on the size of repositories.

### CLI

1. Verify that you have configured[Developer Connect](https://cloud.google.com/developer-connect/docs/overview)and connected to your repository:
   - [GitHub.com](https://cloud.google.com/developer-connect/docs/connect-github-repo)
   - [GitLab.com](https://cloud.google.com/developer-connect/docs/connect-gitlab)
   - [Bitbucket.org](https://cloud.google.com/developer-connect/docs/connect-bitbucket-cloud)
2. In a shell environment, run the[`gcloud components update`command](https://cloud.google.com/sdk/gcloud/reference/components/update)to verify that you have updated all installed components of the[gcloud](https://cloud.google.com/sdk/gcloud)to the latest version. For this step, you can install and initialize the gcloud, or you can use[Cloud Shell Editor](https://cloud.google.com/shell/docs).

       gcloud components update

3. Create an index. Code customization relies on an index to analyze and parse your repository for quicker code generation suggestions and lookups.

   1. To create the index, in a shell environment, use the[`gemini code-repository-indexes create`command](https://cloud.google.com/sdk/gcloud/reference/gemini/code-repository-indexes/create):

          gcloud gemini code-repository-indexes create <var translate="no">INDEX_NAME</var> \
              --project=<var translate="no">PROJECT_ID</var> \
              --location=<var translate="no">REGION</var>

      Replace the following:
      - <var translate="no">INDEX_NAME</var>: your index name.**Important**: Note your index name. You need it for several steps in this document.
      - <var translate="no">PROJECT_ID</var>: your Google Cloud project ID.
      - <var translate="no">REGION</var>: the region that is configured in Developer Connect in your Cloud project. For commands to succeed, you must specify a[supported region](https://developers.google.com/gemini-code-assist/docs/code-customization-overview#limitations).

      Index creation generally takes 30 minutes to complete, but it might take up to an hour.

      Google limits the number of code repository indexes to one for each project and organization.
4. Control access to your index using repository groups. A repository group is a container for the indexing configuration, which includes repositories and their branch patterns. Repository groups are designed for granular IAM control, giving developers access to the indexed data from those groups, where they have the`cloudaicompanion.repositoryGroups.use`permission.

   Repository groups contain Developer Connect repositories, or links, from the same project and location.

   Administrators perform the following actions:
   - Create the Code Repository Index resource.
   - In the same project and location, configure a new Developer Connect connection.
   - Link Git repos in the connection.
   - Get links' resource names, pick branch pattern to index for each link, and put it to one or multiple repository groups.

   To create a repository group, in a shell environment, use the[`gemini code-repository-indexes repository-groups create`command](https://cloud.google.com/sdk/gcloud/reference/gemini/code-repository-indexes/repository-groups/create):  

       gcloud gemini code-repository-indexes repository-groups create <var translate="no">REPOSITORY_GROUP</var> \
           --project=<var translate="no">PROJECT_ID</var> \
           --location=<var translate="no">REGION</var> \
           --code-repository-index=<var translate="no">INDEX_NAME</var> \
           --repositories='[{"resource": "<var translate="no">REPOSITORY_RESOURCE_NAME</var>", "branchPattern": "<var translate="no">BRANCH_NAMES</var>"}]'

   | **Note:** You can use regular expression in[RE2 syntax](https://github.com/google/re2/wiki/syntax)to specify branch names.

   Replace the following:
   - <var translate="no">REPOSITORY_GROUP</var>: name of the repository group, such as`default`.
   - <var translate="no">REPOSITORY_RESOURCE_NAME</var>: name of the repository inside the Developer Connect connection. To find the name of the repository, go to the[**Git repositories**page](https://console.cloud.google.com/developer-connect)in the Google Cloud console, and in the**Repositories** tab, look for the Connection ID under the**Connection** column in the table. To copy the resource name, click themore_vertmenu for more options, and select**Copy resource path**.
   - <var translate="no">BRANCH_NAMES</var>: name of the branches you want to index, such as`main|dev`.

   You also can create a repository group with repositories defined in a JSON (or YAML) file, formatted as follows:  

   ### JSON

       [
         {
             "resource": "<var translate="no">REPOSITORY_RESOURCE_NAME</var>", "branchPattern": "main|dev"
         },
         {
             "resource": "<var translate="no">REPOSITORY_RESOURCE_NAME</var>", "branchPattern": "dev"
         }
       ]

   ### YAML

       - resource: <var translate="no"><span class="devsite-syntax-l devsite-syntax-l-Scalar devsite-syntax-l-Scalar-Plain">REPOSITORY_RESOURCE_NAME</span></var>
         branchPattern: main|dev

       - resource: <var translate="no"><span class="devsite-syntax-l devsite-syntax-l-Scalar devsite-syntax-l-Scalar-Plain">REPOSITORY_RESOURCE_NAME</span></var>
         branchPattern: dev

   To create a repository group based on a JSON or YAML file, in a shell environment, use the[`gemini code-repository-indexes repository-groups create`command](https://cloud.google.com/sdk/gcloud/reference/gemini/code-repository-indexes/repository-groups/create):  

   ### JSON

       gcloud gemini code-repository-indexes repository-groups create <var translate="no">REPOSITORY_GROUP</var> \
           --project=<var translate="no">PROJECT_ID</var> \
           --location=<var translate="no">REGION</var> \
           --code-repository-index=<var translate="no">INDEX_NAME</var> \
           --repositories=<var translate="no">FILEPATH</var>.json

   ### YAML

       gcloud gemini code-repository-indexes repository-groups create <var translate="no">REPOSITORY_GROUP</var> \
           --project=<var translate="no">PROJECT_ID</var> \
           --location=<var translate="no">REGION</var> \
           --code-repository-index=<var translate="no">INDEX_NAME</var> \
           --repositories=<var translate="no">FILEPATH</var>.yaml

   If preferred, you can encrypt and control your data with a customer-managed encryption key (CMEK) through[Cloud Key Management Service](https://cloud.google.com/kms/docs). To learn more about using a CMEK, see[Encrypt data with customer-managed encryption keys](https://cloud.google.com/gemini/docs/codeassist/encrypt-data-cmek).
5. Grant IAM roles to the repository group on a project.

   You only receive suggestions from repositories in the index. Each repository belongs to one or multiple repository groups. To access suggestions, you must grant the Cloud AI Companion Repository Groups User IAM role (`roles/cloudaicompanion.repositoryGroupsUser`)---which contains the required`cloudaicompanion.repositoryGroups.user`IAM permission---to the repository group by one of the following ways:
   - Grant principals permission to access the entire index.
   - Grant principals access to a subset of the index.

   ### Entire index

   1. To bind an IAM policy for a project, in a shell environment, use the[`projects add-iam-policy-binding`command](https://cloud.google.com/sdk/gcloud/reference/projects/add-iam-policy-binding):

          gcloud projects add-iam-policy-binding <var translate="no">PROJECT_ID</var> \
              --member='<var translate="no">PRINCIPAL</var>' \
              --role='roles/cloudaicompanion.repositoryGroupsUser'

      Replace the following:
      - <var translate="no">PRINCIPAL</var>: the email address of the principal that needs access---for example,`user:test-user@gmail.com`for an individual, or`group:admins@example.com`for a group.

      For more information, see[`gcloud projects set-iam-policy`](https://cloud.google.com/sdk/gcloud/reference/projects/set-iam-policy).
   2. When prompted to specify a condition, enter`None`.

   ### Subset of the index

   You can create multiple repository groups and assign IAM roles to different IAM principals.

   In order to set up an IAM policy, you must prepare the IAM policy JSON or YAML file, which will contain a list of IAM groups and assigned roles. For example:  

         bindings:
         - members:
           - group:my-group@example.com
           - user:test-user@example.com
           role: roles/cloudaicompanion.repositoryGroupsUser

   For additional details and syntax, see[Understanding allow policies](https://cloud.google.com/iam/docs/policies).
   | **Note:** You can assign custom roles to your IAM groups, but the custom role must contain all permissions of the`roles/cloudaicompanion.repositoryGroupsUser`role.

   To set the IAM policy, in a shell environment, use the[`gemini code-repository-indexes repository-groups set-iam-policy`command](https://cloud.google.com/sdk/gcloud/reference/gemini/code-repository-indexes/repository-groups/set-iam-policy):  

         gcloud gemini code-repository-indexes repository-groups set-iam-policy <var translate="no">GROUP_NAME</var><var translate="no">POLICY_FILE</var> \
             --project=<var translate="no">PROJECT_ID</var> \
             --location=<var translate="no">REGION</var> \
             --code-repository-index=<var translate="no">INDEX_NAME</var>

   Replace the following:
   - <var translate="no">GROUP_NAME</var>: the repository group name you created in a preceding step to control access to your index using repository groups.
   - <var translate="no">POLICY_FILE</var>: the IAM policy.

     For more information, see[`gcloud gemini code-repository-indexes repository-groups set-iam-policy`](https://cloud.google.com/sdk/gcloud/reference/gemini/code-repository-indexes/repository-groups/set-iam-policy).

### Terraform

1. Verify that you have configured[Developer Connect](https://cloud.google.com/developer-connect/docs/overview)and connected to your repository:

   - [GitHub.com](https://cloud.google.com/developer-connect/docs/connect-github-repo)
   - [GitLab.com](https://cloud.google.com/developer-connect/docs/connect-gitlab)
   - [Bitbucket.org](https://cloud.google.com/developer-connect/docs/connect-bitbucket-cloud)
2. Create an index. Code customization relies on an index to analyze and parse your repository for quicker code generation suggestions and lookups.

       resource "google_gemini_code_repository_index" "example" {
         location = "<var translate="no">REGION</var>"
         code_repository_index_id = "<var translate="no">INDEX_NAME</var>"
       }

   Replace the following:
   - <var translate="no">INDEX_NAME</var>: your index name.**Important**: Note your index name. You need it for several steps in this document.
   - <var translate="no">PROJECT_ID</var>: your Google Cloud project ID.
   - <var translate="no">REGION</var>: the region that is configured in Developer Connect in your Cloud project. For commands to succeed, you must specify a[supported region](https://developers.google.com/gemini-code-assist/docs/code-customization-overview#limitations).

   Index creation generally takes 30 minutes to complete, but it might take up to an hour.

   Google limits the number of code repository indexes to one for each project and organization.
3. Control access to your index using repository groups. A repository group is a container for the indexing configuration, which includes repositories and their branch patterns. Repository groups are designed for granular IAM control, giving developers access to the indexed data from those groups, where they have the`cloudaicompanion.repositoryGroups.use`permission.

   Repository groups contain Developer Connect repositories, or links, from the same project and location.

   Administrators perform the following actions:
   - Create Code the Repository Index resource.
   - In the same project and location, configure a new Developer Connect connection.
   - Link Git repos in the connection.
   - Get links' resource names, pick branch pattern to index for each link, and put it to one or multiple repository groups.

       resource "google_gemini_repository_group" "example" {
         location = "<var translate="no">REGION</var>"
         code_repository_index = "<var translate="no">INDEX_NAME</var>"
         repository_group_id = "<var translate="no">REPOSITORY_GROUP</var>"
         repositories {
           resource = "<var translate="no">REPOSITORY_RESOURCE_NAME</var>"
           branch_pattern = "<var translate="no">BRANCH_NAMES</var>"
         }
       }

   | **Note:** You can use regular expression in[RE2 syntax](https://github.com/google/re2/wiki/syntax)to specify branch names.

   Replace the following:
   - <var translate="no">REPOSITORY_GROUP</var>: name of the repository group, such as`default`.
   - <var translate="no">REPOSITORY_RESOURCE_NAME</var>: name of the repository inside the Developer Connect connection. To find the name of the repository, go to the[**Git repositories**page](https://console.cloud.google.com/developer-connect)in the Google Cloud console, and in the**Repositories** tab, look for the Connection ID under the**Connection** column in the table. To copy the resource name, click themore_vertmenu for more options, and select**Copy resource path**.
   - <var translate="no">BRANCH_NAMES</var>: name of the branches you want to index, such as`main|dev`.

   You also can create a repository group with repositories defined in a JSON (or YAML) file, formatted as follows:  

   ### JSON

       [
         {
             "resource": "<var translate="no">REPOSITORY_RESOURCE_NAME</var>", "branchPattern": "main|dev"
         },
         {
             "resource": "<var translate="no">REPOSITORY_RESOURCE_NAME</var>", "branchPattern": "dev"
         }
       ]

   ### YAML

       - resource: <var translate="no"><span class="devsite-syntax-l devsite-syntax-l-Scalar devsite-syntax-l-Scalar-Plain">REPOSITORY_RESOURCE_NAME</span></var>
         branchPattern: main|dev

       - resource: <var translate="no"><span class="devsite-syntax-l devsite-syntax-l-Scalar devsite-syntax-l-Scalar-Plain">REPOSITORY_RESOURCE_NAME</span></var>
         branchPattern: dev

   To create a repository group based on a JSON or YAML file, in a shell environment, use the[`gemini code-repository-indexes repository-groups create`command](https://cloud.google.com/sdk/gcloud/reference/gemini/code-repository-indexes/repository-groups/create):  

   ### JSON

       gcloud gemini code-repository-indexes repository-groups create <var translate="no">REPOSITORY_GROUP</var> \
           --project=<var translate="no">PROJECT_ID</var> \
           --location=<var translate="no">REGION</var> \
           --code-repository-index=<var translate="no">INDEX_NAME</var> \
           --repositories=<var translate="no">FILEPATH</var>.json

   ### YAML

       gcloud gemini code-repository-indexes repository-groups create <var translate="no">REPOSITORY_GROUP</var> \
           --project=<var translate="no">PROJECT_ID</var> \
           --location=<var translate="no">REGION</var> \
           --code-repository-index=<var translate="no">INDEX_NAME</var> \
           --repositories=<var translate="no">FILEPATH</var>.yaml

   If preferred, you can encrypt and control your data with a customer-managed encryption key (CMEK) through[Cloud Key Management Service](https://cloud.google.com/kms/docs). To learn more about using a CMEK, see[Encrypt data with customer-managed encryption keys](https://cloud.google.com/gemini/docs/codeassist/encrypt-data-cmek).
4. Grant IAM roles to the repository group on a project.

   You only receive suggestions from repositories in the index. Each repository belongs to one or multiple repository groups. To access suggestions, you must grant the Cloud AI Companion Repository Groups User IAM role (`roles/cloudaicompanion.repositoryGroupsUser`)---which contains the required`cloudaicompanion.repositoryGroups.user`IAM permission---to the repository group by one of the following ways:
   - Grant principals permission to access the entire index.
   - Grant principals access to a subset of the index.

   ### Entire index

   1. To bind an IAM policy for a project, in a shell environment, use the[`projects add-iam-policy-binding`command](https://cloud.google.com/sdk/gcloud/reference/projects/add-iam-policy-binding):

          gcloud projects add-iam-policy-binding <var translate="no">PROJECT_ID</var> \
              --member='<var translate="no">PRINCIPAL</var>' \
              --role='roles/cloudaicompanion.repositoryGroupsUser'

      Replace the following:
      - <var translate="no">PRINCIPAL</var>: the email address of the principal that needs access---for example,`user:test-user@gmail.com`for an individual, or`group:admins@example.com`for a group.

        For more information, see[`gcloud projects set-iam-policy`](https://cloud.google.com/sdk/gcloud/reference/projects/set-iam-policy).
   2. When prompted to specify a condition, enter`None`.

   ### Subset of the index

   You can create multiple repository groups and assign IAM roles to different IAM principals.  

         data "google_iam_policy" "foo" {
           binding {
             role = "roles/cloudaicompanion.repositoryGroupsUser"
             members = ["test-user@example.com"]
           }
         }

         resource "google_gemini_repository_group_iam_policy" "foo" {
           project = "<var translate="no">PROJECT_ID</var>"
           location = "<var translate="no">REGION</var>"
           code_repository_index_id = "<var translate="no">INDEX_NAME</var>"
           repository_group_id = "<var translate="no">GROUP_NAME</var>"
           policy_data = data.google_iam_policy.foo.policy_data
         }

         data "google_gemini_repository_group_iam_policy" "foo" {
           project = "<var translate="no">PROJECT_ID</var>"
           location = "<var translate="no">REGION</var>"
           code_repository_index_id = "<var translate="no">INDEX_NAME</var>"
           repository_group_id = "<var translate="no">GROUP_NAME</var>"
           depends_on = [
             google_gemini_repository_group_iam_policy.foo
           ]
         }

   You can also create a binding:  

         resource "google_gemini_repository_group_iam_binding" "foo" {
           project = "<var translate="no">PROJECT_ID</var>"
           location = "<var translate="no">REGION</var>"
           code_repository_index_id = "<var translate="no">INDEX_NAME</var>"
           repository_group_id = "<var translate="no">GROUP_NAME</var>"
           role = "roles/cloudaicompanion.repositoryGroupsUser"
           members = ["test-user@example.com"]
         }

   Replace the following:
   - <var translate="no">GROUP_NAME</var>: the repository group name you created in a preceding step to control access to your index using repository groups.

## Check indexing status

Depending on the number of repositories you want to index and their size, indexing content can take up to 24 hours. For large repositories, indexing can take longer. Indexing occurs once every 24 hours, picking up any changes that were made in the repository.

1. Search for the`indexing`logs. For more information, see[Logging query language](https://cloud.google.com/logging/docs/view/logging-query-language).

   ### Console

   1. In the Google Cloud console, go to the[**Logs Explorer**](https://cloud.google.com/logging/docs/view/logs-explorer-interface).

      [Go to Logs Explorer](https://console.cloud.google.com/logs/query)
   2. Use the log names filter to view`indexing`logs.

   ### CLI

   To search for the indexing logs, in a shell environment, use the[`logging read`command](https://cloud.google.com/sdk/gcloud/reference/logging/read):  

       gcloud logging read "logName="projects/<var translate="no">PROJECT_ID</var>/logs/indexing""

   Replace<var translate="no">PROJECT_ID</var>with the project ID where the repository group is located.

   For example, to view errors in the`indexing`logs, run the following command:  

       gcloud logging read "logName="projects/<var translate="no">PROJECT_ID</var>/logs/indexing" AND severity>=ERROR"

2. Review the associated indexing statuses, such as the following:

   - Start of repository indexing-for example,`Indexing repository `<var translate="no">REPOSITORY_NAME</var>`. Total number of repositories: 10, succeeded: 6, failed: 0.`
   - End of individual repository indexing-for example:
     - Success:`Successfully finished indexing repository `<var translate="no">REPOSITORY_NAME</var>`. Total number of repositories: 10, succeeded: 7, failed: 0.`
     - Failure:`Failed to index repository `<var translate="no">REPOSITORY_NAME</var>`. Error: [<error message>]. Total number of repositories: 10, succeeded: 7, failed: 1.`
   - End of repository indexing-for example:
     - Success:`Finished indexing process. Repositories attempted: 10. Repositories successfully indexed: 9. Repositories unsuccessfully fetched: 0.`
     - Failure:`Finished indexing process. Repositories attempted: 10. Repositories successfully indexed: 9. Repositories unsuccessfully fetched: 1. Repositories that were not successfully fetched will be retried in the next run.`

   In the index statuses,<var translate="no">REPOSITORY_NAME</var>is the repository you want to review.
3. Review the associated indexing errors, such as the following:

   - Failed to fetch repository.
   - Failed to list repository files.
   - Failed to retrieve repository information from the index.
   - Failed to retrieve files from the index.
   - Internal error.

## Use code customization

Once you have set up code customization, you'll begin to see code completion and code generation suggestions which may be based on private code you have indexed in addition to results from full codebase awareness.

Developers added to the repository group where at least one resource is indexed will receive a notice in their IDE that code customization was enabled. To see the code customization status, developers can click thespark**Gemini**symbol in the bottom right corner and look for one of the following code customization statuses in the search bar:

- **All set**. Code customization is enabled and configured.
- **Unavailable**. The developer is missing repository group access or the repository group to which the user has access is empty.
- **Unset**. Code customization either isn't enabled or isn't configured by the administrator.

To learn more about using code customization and best practices, see[Use code customization](https://developers.google.com/gemini-code-assist/docs/use-code-customization).

## Turn off code customization

Select one of the following options:  

### Console

1. In the Google Cloud console, go to the**Gemini Products**page.

   [Go to Gemini Products](https://console.cloud.google.com/gemini-admin)

   The**Gemini Products**page loads.
2. In the navigation menu, click**Code customization**.

   The**Code customization**page loads.
3. To delete the index, click**Delete**.

   A warning message is displayed. If you want to proceed and delete the index, enter the index name, and then click**Delete**.

### CLI

1. To list all repository groups for the current index, in a shell environment, use the[`gemini code-repository-indexes repository-groups list`command](https://cloud.google.com/sdk/gcloud/reference/gemini/code-repository-indexes/repository-groups/list):

       gcloud gemini code-repository-indexes repository-groups list --location=<var translate="no">REGION</var> \
           --project=<var translate="no">PROJECT_ID</var> \
           --code-repository-index=<var translate="no">INDEX_NAME</var> --uri

   Replace the following:
   - <var translate="no">REGION</var>: the region that is configured in Developer Connect in your Cloud project. For commands to succeed, you must specify a[supported region](https://developers.google.com/gemini-code-assist/docs/code-customization-overview#limitations).
   - <var translate="no">PROJECT_ID</var>: your Google Cloud project ID.
   - <var translate="no">INDEX_NAME</var>: name of the index you created in a preceding step to create an index.
2. To delete a repository group from the current index, use the[`gemini code-repository-indexes repository-groups delete`command](https://cloud.google.com/sdk/gcloud/reference/gemini/code-repository-indexes/repository-groups/list):

       gcloud gemini code-repository-indexes repository-groups delete <var translate="no">REPOSITORY_GROUP</var> \
           --location=<var translate="no">REGION</var> \
           --project=<var translate="no">PROJECT_ID</var> \
           --code-repository-index=<var translate="no">INDEX_NAME</var>

3. Repeat the preceding steps for each repository group until you delete all repository groups from the index.

4. Optional: To delete the index, in a shell environment, use the[`gemini code-repository-indexes delete`command](https://cloud.google.com/sdk/gcloud/reference/gemini/code-repository-indexes/delete):

       gcloud gemini code-repository-indexes delete <var translate="no">INDEX_NAME</var> \
           --location=<var translate="no">REGION</var> \
           --project=<var translate="no">PROJECT_ID</var>

## What's next

- Start using Gemini Code Assist:
  - VS Code, IntelliJ, and other supported JetBrains IDEs:[Code with Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/write-code-gemini-standard-enterprise)
  - Cloud Shell:[Code with Gemini Code Assist](https://cloud.google.com/code/docs/shell/write-code-gemini)
  - Cloud Workstations:[Code with Gemini Code Assist](https://cloud.google.com/workstations/docs/write-code-gemini)
- Learn how to[use code customization](https://developers.google.com/gemini-code-assist/docs/use-code-customization)and best practices.
- Learn how to[encrypt data with customer-managed encryption keys (CMEK)](https://cloud.google.com/gemini/docs/codeassist/encrypt-data-cmek).
- Learn more about[Developer Connect](https://cloud.google.com/developer-connect/docs/overview).
- Learn[how and when Gemini for Google Cloud uses your data](https://developers.google.com/gemini-code-assist/docs/data-governance).





| **Note:** Gemini Code Assist code customization is available only in Gemini Code Assist Enterprise. For more information, see[Gemini Code Assist supported features](https://developers.google.com/gemini-code-assist/docs/overview#supported-features).

This document describes how to use[Gemini Code Assist code customization](https://developers.google.com/gemini-code-assist/docs/code-customization-overview)and provides a few best practices. This feature lets you receive code recommendations, which draw from the internal libraries, private APIs, and the coding style of your organization.

## Before you begin

1. [Set up Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise)with an[Enterprise subscription](https://developers.google.com/gemini-code-assist/docs/overview#supported-features).
2. [Set up Gemini Code Assist code customization](https://developers.google.com/gemini-code-assist/docs/code-customization-console).

## How to use code customization

The following table lists ways to use Gemini Code Assist code customization:

|           Form            |                                                                                                                                                       How to trigger                                                                                                                                                       |                                                                                                                                                                                                                          Notes and resources                                                                                                                                                                                                                          |
|   Natural language chat   |                                                                                                                           Enter a natural language prompt in Gemini Code Assist chat in the IDE.                                                                                                                           | Consider the following: - Chat history is not available. Avoid multi-step queries. - You can ask for more details about sources, including links to the specific sources. - If you highlight or select code when you send a message in chat, Gemini Code Assist uses that code to improve code customization and chat quality. For more information, see[Chat with Gemini Code Assist](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#chat). |
|       Generate code       |                                                                                        In the quick pick bar in your IDE, either with or without selected code, press<kbd>Command+Enter</kbd>(on macOS) or<kbd>Control+Enter</kbd>.                                                                                        |                                                                                                                                                      For more information, see[Generate code with prompts](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#generate_code_with_prompts).                                                                                                                                                       |
|      Transform code       |                                                                                                                   In the quick pick bar in your IDE, either with or without selected code, enter`/fix`.                                                                                                                    |                                                                                                                                                      For more information, see[Generate code with prompts](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#generate_code_with_prompts).                                                                                                                                                       |
|       Autocomplete        |                                                                                                              Code customization is automatically triggered and provides suggestions based on what you write.                                                                                                               |    Consider the following: - Code completion needs a certain level of confidence to propose a suggestion. Ensure that a substantial amount of code is available so that relevant snippets are retrieved. - Code completion checks if you have required libraries in order to use certain elements of the function. For more information, see[Get code completions](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#get_code_completions).     |
| Remote repository context | 1. Start your prompt with the<kbd>@</kbd>symbol. A list of available remote repositories that are indexed appears. 2. Select the repository you want to use for context from the list. You can also start typing the repository name to filter the list. 3. After selecting the repository, write the rest of your prompt. |                                          Remote repository context is useful when you are working on a task that is mostly related to a specific set of microservices, libraries, or modules. For more information, see[Get more relevant suggestions with remote repository context](https://developers.google.com/gemini-code-assist/docs/write-code-gemini#get_more_relevant_suggestions_with_remote_repository_context).                                          |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

## Use cases and prompt examples

The following table provides guidance and examples about using code customization in specific use cases:

|                  Use case                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Things worth trying                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
|              Writing new code               |                                                                                Try the following to generate code in your IDE or Gemini Code Assist chat: - Generate code that would use terms which are already mentioned in your codebase. - Paste in your code, such as a functional signature or code with`TODO`comments, and then ask Gemini Code Assist to fill in or replace`TODO`comments with code. Add comments with explanation from context. Try generating code with the following prompts in Gemini Code Assist chat: - "Write a main function where a connection to<var translate="no">DATABASE</var>is created. Include health checks." - "Write a<var translate="no">FUNCTION_OR_CLASS</var>in the following structure:<var translate="no">EXPLAIN_STRUCTURE</var>." After you generate some code, try using a follow-up prompt to improve it: - "Try the`/fix`command to adjust the generated code---for example, syntax errors." - "Add missing imports." - "Try`/fix`on chat-generated code."                                                                                 |
| Cleaning, simplifying, and refactoring code |                                                                                                                                                                                                                                                                         Try the following prompts in Gemini Code Assist chat: - "Can you merge<var translate="no">IMPORTS_VARIABLES_OR_NOTE_EXPORTED_FUNCTIONS</var>in this file?" - "How would you simplify the<var translate="no">FUNCTION_NAME</var>function?" - "Can you merge<var translate="no">FUNCTION_NAME_1</var>and<var translate="no">FUNCTION_NAME_2</var>into one function?" - "Could you inline some variables in<var translate="no">FUNCTION_NAME</var>?" - "Could you simplify variable naming in the function<var translate="no">FUNCTION_NAME</var>?"                                                                                                                                                                                                                                                                          |
|                 Readability                 |                                                                                                                                                                                                                                                                                                                                Try the following prompts in Gemini Code Assist chat: - "Write the function<var translate="no">FUNCTION_NAME</var>in fewer lines of code, if possible." - "Add comments to the function<var translate="no">FUNCTION_NAME</var>." - "Remove unnecessary whitespaces in the function<var translate="no">FUNCTION_NAME</var>." - "Format the function<var translate="no">FUNCTION_NAME</var>in a similar way as the rest of the code."                                                                                                                                                                                                                                                                                                                                |
|                 Code review                 |                                                                                                                                                                                                                                                                                                                                     Try the following prompts in Gemini Code Assist chat: - "Split the code in parts and explain each part using our codebase." - "Are there variables or keywords that could be shorter and more self-explanatory?" - "Can you give me useful code from the<var translate="no">REPOSITORY_NAME_PACKAGE_MODULE</var>context for this code?" - "What do you think about the function<var translate="no">FUNCTION_NAME</var>?"                                                                                                                                                                                                                                                                                                                                      |
|                  Debugging                  |                                                                                                                                                                                                                                                                                                                                                                                                Try the following prompts in Gemini Code Assist chat: - "I am getting an error when I try to do X/add Y. Why?" - "Can you spot an error in the function<var translate="no">FUNCTION_NAME</var>?" - "How would you fix the function<var translate="no">FUNCTION_NAME</var>given this error message?"                                                                                                                                                                                                                                                                                                                                                                                                |
|           Learning and onboarding           |                                                                                                                                                                                                                        Try the following prompts in Gemini Code Assist chat: - "Split this code in parts and explain each of them using our codebase." - "Show how to call function<var translate="no">FUNCTION_NAME</var>?" - "Show how to run the main function in the<var translate="no">ENVIRONMENT_NAME</var>environment?" - "What is the key technical improvement we can do to make this code more performant?" - "Show me the implementation of<var translate="no">FUNCTION_OR_CLASS_NAME</var>to achieve better results and add what that specific element is"---for example, "Show me the implementation of function foo where foo is the name of the function."                                                                                                                                                                                                                        |
|                  Migration                  | Try the following prompts in Gemini Code Assist chat: - "Give me a strategy for how I can migrate<var translate="no">FILE_NAME</var>from<var translate="no">LANGUAGE_1</var>to<var translate="no">LANGUAGE_2</var>"---for example, from Go to Python. - "Given the function<var translate="no">FUNCTION_NAME</var>in repository<var translate="no">REPOSITORY_NAME</var>, find me an equivalent function in language<var translate="no">LANGUAGE_NAME</var>that I can use." Try the following chat-based or code generation transformation workflow using prompts: 1. "Take<var translate="no">FILENAME_COMPONENT</var>code already written in<var translate="no">LANGUAGE_1</var>and refactor and migrate it to<var translate="no">LANGUAGE_2</var>"---for example, from Go to Python. 2. After you migrate some code, try the following: - Select smaller chunks and use`/fix`to get it into a state that you want. - Try the following prompts: - "Is there something which can be improved?" - "Give me possible pain points." - "How would you test this code if that migration is correct?" |
|          Generating documentation           |                                                                                                                                                                                                                                                                                                                                                                           Try the following prompts in Gemini Code Assist chat: - "Summarize the code in package or folder<var translate="no">X</var>and provide documentation for the top five important methods." - "Generate documentation for<var translate="no">FUNCTION_OR_CLASS_NAME</var>." - "Shorten the documentation while preserving the key information."                                                                                                                                                                                                                                                                                                                                                                           |
|            Unit test generation             |                                                                                                                                                                                                                                                                                                                                                                                                          Try the following prompts in Gemini Code Assist chat: - "Generate unit tests for<var translate="no">FILENAME</var>." - "Add the most relevant test cases for the<var translate="no">FUNCTION_NAME</var>function." - "Remove test cases that you think don't bring much value."                                                                                                                                                                                                                                                                                                                                                                                                           |
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

## Best practices

- **Use relevant variable and function names or code snippets.**This guides code customization towards the most pertinent code examples.
- **Use index repositories that you want to scale, and avoid adding deprecated functionality.**Code customization helps to scale to the code style, patterns, code semantics, knowledge, and implementations across the codebase. Bad examples of repositories to scale are deprecated functionalities, generated code, and legacy implementations.
- **For code retrieval use cases, use code generation functionality instead of code completion** . Prompt using language such as "Using the definition of<var translate="no">FUNCTION_NAME</var>, generate the exact same function," or "Generate the exact implementation of<var translate="no">FUNCTION_NAME</var>."
- **Have includes or imports present in the file for the code that you want to retrieve**to improve Gemini contextual awareness.
- **Execute only one action for each prompt.**For example, if you want to retrieve code and have this code be implemented in a new function, perform these steps over two prompts.
- **For use cases where you want more than just code**(such as code explanation, migration plan, or error explanation), use code customization for chat, where you have a conversation with Gemini with your codebase in context.
- **Note that AI model generation is non-deterministic**. If you aren't satisfied with the response, executing the same prompt again might achieve a better result.
- **Note that generating unit tests**generally works better if you open the file locally, and then from chat, ask to generate unit tests for this file or a specific function.

### **Get more relevant suggestions with remote repository context**

You can get more contextually aware and relevant code suggestions by directing Gemini Code Assist to focus on specific remote repositories. By using the<kbd>@</kbd>symbol in the chat, you can select one or more repositories to be used as a primary source of context for your prompts. This is useful when you are working on a task that is mostly related to a specific set of microservices, libraries, or modules.

To use a remote repository as context, follow these steps in your IDE's chat:

1. Start your prompt with the<kbd>@</kbd>symbol. A list of available remote repositories that are indexed will appear.
2. Select the repository you want to use for context from the list. You can also start typing the repository name to filter the list.
3. After selecting the repository, write the rest of your prompt.

Gemini will then prioritize the selected repository when generating a response.

#### **Example Prompts**

Here are some examples of how you can use this feature:

- **To understand a repository:**
  - "<kbd>@</kbd><var translate="no">REPOSITORY_NAME</var>What is the overall structure of this repository?"
  - "<kbd>@</kbd><var translate="no">REPOSITORY_NAME</var>I'm a new team member. Can you give me an overview of this repository's purpose and key modules?"
- **For code generation and modification:**
  - "<kbd>@</kbd><var translate="no">REPOSITORY_NAME</var>Implement an authentication function similar to the one in this repository."
  - "<kbd>@</kbd><var translate="no">REPOSITORY_NAME</var>Refactor the following code to follow the conventions in the selected repository."
  - "<kbd>@</kbd><var translate="no">REPOSITORY_A_NAME</var>How can I use the latest functions from this repository to improve my code in<var translate="no">REPOSITORY_B_NAME</var>?"
- **For testing:**
  - "<kbd>@</kbd><var translate="no">UNIT_TEST_FILE_NAME</var>Generate unit tests for<var translate="no">MODULE</var>based on the examples in the selected file."

By using remote repositories as a focused source of context, you can get more accurate and relevant suggestions from Gemini Code Assist, which can help you code faster and more efficiently.



| **Note:** Gemini Code Assist code customization is available only in Gemini Code Assist Enterprise. For more information, see[Gemini Code Assist supported features](https://developers.google.com/gemini-code-assist/docs/overview#supported-features).

This document shows how to use customer-managed encryption keys (CMEK) to encrypt and control data-at-rest in a cloud service through[Cloud Key Management Service](https://cloud.google.com/kms/docs). CMEK is integrated with[code customization](https://developers.google.com/gemini-code-assist/docs/code-customization-overview)for Gemini Code Assist. Gemini Code Assist doesn't support the use of[Cloud EKM](https://cloud.google.com/kms/docs/ekm)keys.

In this document, you do the following:

- Learn how to create a CMEK.
- Grant permissions to the Gemini Code Assist service account.
- Create a code repository index with a CMEK.
- Remove access to a CMEK repository.

By default, Gemini for Google Cloud[encrypts customer content at rest](https://cloud.google.com/docs/security/encryption/default-encryption). Gemini handles encryption for you without any additional actions on your part. This option is called*Google default encryption*.

After you set up your resources with CMEKs, the experience of accessing your Gemini resources is similar to using Google default encryption. For more information about your encryption options, see[Customer-managed encryption keys (CMEK)](https://cloud.google.com/kms/docs/cmek).

## Before you begin

1. In one of the following development environments, set up the gcloud CLI:

   - **Cloud Shell** : to use an online terminal with the gcloud CLI already set up,[launch the Cloud Shell editor](https://ide.cloud.google.com).

   - **Local shell** : to use a local development environment,[install](https://cloud.google.com/sdk/docs/install)and[initialize](https://cloud.google.com/sdk/docs/initializing)the gcloud CLI.

   If you're using an external identity provider (IdP), you must first[sign in to the gcloud CLI with your federated identity](https://cloud.google.com/iam/docs/workforce-log-in-gcloud).
2. In the development environment where you set up the gcloud CLI, run the[`gcloud components update`command](https://cloud.google.com/sdk/gcloud/reference/components/update)to make sure that you have updated all installed components of the[gcloud](https://cloud.google.com/sdk/gcloud)to the latest version.

       gcloud components update

## Create a CMEK and grant permissions

To create a CMEK and grant the Gemini Code Assist service account permissions on the key, perform the following tasks:

1. In the Google Cloud project where you want to manage your keys, do the following:

   1. [Enable the Cloud Key Management Service API](https://console.cloud.google.com/flows/enableapi?apiid=cloudkms.googleapis.com&redirect=https://console.cloud.google.com).

   2. Create the[key ring](https://cloud.google.com/kms/docs/create-key-ring)and[key](https://cloud.google.com/kms/docs/create-key)directly in Cloud KMS.

2. Grant the[CryptoKey Encrypter/Decrypter IAM role](https://cloud.google.com/iam/docs/roles-permissions/cloudkms#cloudkms.cryptoKeyEncrypterDecrypter)(`roles/cloudkms.cryptoKeyEncrypterDecrypter`) to the Gemini Code Assist service account. Grant this permission on the key that you created.

   ### Console

   1. Go to**Key management**.

      [Go to Key management](https://console.cloud.google.com/security/kms)
   2. Select the key that you created.

   3. Grant access to the Gemini Code Assist service account:

      1. Click**Add principal**.
      2. Add the Gemini Code Assist service account. The service account is`service-`<var translate="no">PROJECT_NUMBER</var>`@gcp-sa-cloudaicompanions.`, where<var translate="no">PROJECT_NUMBER</var>is the[project number](https://cloud.google.com/resource-manager/docs/creating-managing-projects#identifying_projects)of the Google Cloud project where Gemini Code Assist is enabled.
      3. In**Select a role** , select**Cloud KMS** \>**Cloud KMS CryptoKey Encrypter/Decrypter**.
      4. Click**Save**.
   4. Repeat the previous step to grant access to the account that will create the code repository index with a CMEK.

   5. Return to the**[Key management](https://console.cloud.google.com/security/kms)**page and select the key again.

   6. Select**Show info panel** . You should see roles in the**Role/Member**column.

   ### gcloud

   1. To grant access to the Gemini Code Assist service account, in a shell environment, use the[`kms keys add-iam-policy-binding`command](https://cloud.google.com/sdk/gcloud/reference/projects/add-iam-policy-binding):

          gcloud kms keys add-iam-policy-binding <var translate="no">KEY_NAME</var> \
              --project=<var translate="no">PROJECT_ID</var> \
              --location=<var translate="no">LOCATION</var> \
              --keyring=<var translate="no">KEYRING_NAME</var> \
              --member="serviceAccount:service-<var translate="no">PROJECT_NUMBER</var>@gcp-sa-cloudaicompanion." \
              --role="roles/cloudkms.cryptoKeyEncrypterDecrypter"

      Replace the following:
      - <var translate="no">KEY_NAME</var>: the key name.
      - <var translate="no">PROJECT_ID</var>: the ID of the project that contains the key.
      - <var translate="no">LOCATION</var>: the key location.
      - <var translate="no">KEYRING_NAME</var>: the key ring name.
      - <var translate="no">PROJECT_NUMBER</var>: the[project number](https://developers.google.com/resource-manager/docs/creating-managing-projects#identifying_projects)of the Google Cloud project with Gemini Code Assist enabled.
   2. Repeat the previous step to grant access to the account that will create the code repository index with a CMEK.

   For more information about this command, see the[`gcloud kms keys add-iam-policy-binding`documentation](https://cloud.google.com/sdk/gcloud/reference/kms/keys/add-iam-policy-binding).

You can now[create a code repository index with a CMEK](https://developers.google.com/gemini-code-assist/docs/encrypt-data-cmek#create_a_code_repository_index_with_a_cmek)using the API, and specify the key to use for encryption.

## Create a code repository index with a CMEK

To create a new repository that has CMEK protection, do one of the following:  

### gcloud

Use the[`gemini code-repository-indexes create`command](https://cloud.google.com/sdk/gcloud/reference/gemini/code-repository-indexes/create):  

    gcloud gemini code-repository-indexes create <var translate="no">CODE_REPOSITORY_INDEX_NAME</var> \
        --location=<var translate="no">LOCATION</var> \
        --kms-key="projects/<var translate="no">KEY_PROJECT_ID</var>/locations/<var translate="no">LOCATION</var>/keyRings/<var translate="no">KEYRING_NAME</var>/cryptoKeys/<var translate="no">KEY_NAME</var>"

Replace the following:

- <var translate="no">CODE_REPOSITORY_INDEX_NAME</var>: the name of the new code repository index that you'll create.
- <var translate="no">LOCATION</var>: the key location.
- <var translate="no">KEY_PROJECT_ID</var>: the key project ID.
- <var translate="no">KEYRING_NAME</var>: the key ring name.
- <var translate="no">KEY_NAME</var>: the key name.

### API

1. Create a JSON file that contains the following information:

   ```
     {
       "kmsKey": "projects/KEY_PROJECT_ID/locations/KEY_LOCATION/keyRings/KEYRING_NAME/cryptoKeys/KEY_NAME"
     }
   ```

   Replace the following:
   - <var translate="no">KEY_PROJECT_ID</var>: the key project ID
   - <var translate="no">KEY_LOCATION</var>: the key location
   - <var translate="no">KEYRING_NAME</var>: the key ring name
   - <var translate="no">KEY_NAME</var>: the key name
2. Use a[`cURL`](http://curl.haxx.se/)command to call the[`projects.locations.codeRepositoryIndexes.create`method](https://cloud.google.com/gemini/docs/api/reference/rest/v1/projects.locations.codeRepositoryIndexes/create):

   ```
   curl -X POST --data-binary @JSON_FILE_NAME \
       -H "Authorization: Bearer $(gcloud auth print-access-token)" \
       -H "Content-Type: application/json" \
       "https://cloudaicompanion.googleapis.com/v1/projects/PROJECT_ID/locations/KEY_LOCATION/codeRepositoryIndexes?codeRepositoryIndexId=CODE_REPOSITORY_INDEX_NAME"
   ```

   Replace the following:
   - <var translate="no">JSON_FILE_NAME</var>: the path for the JSON file that you created in the preceding step.
   - <var translate="no">PROJECT_ID</var>: the ID of the project to create the repository in.
   - <var translate="no">KEY_LOCATION</var>: the location to create the repository in, which must match the location where the CMEK exists.
   - <var translate="no">CODE_REPOSITORY_INDEX_NAME</var>: the name of the new code repository index that you'll create. For example,`zg-btf-0001`.

The response returns a set of log entries.

## Remove access to a CMEK repository

| **Warning:** If you disable the CMEK, Google Cloud removes the instance and the service will no longer be available, even if you re-enable the key.

There are several ways to remove access to a CMEK-encrypted repository:

- Revoke the Cloud KMS CryptoKey Encrypter/Decrypter[role](https://cloud.google.com/kms/docs/reference/permissions-and-roles#predefined_roles)from the Gemini Code Assist service account using the[Google Cloud console](https://cloud.google.com/iam/docs/granting-changing-revoking-access#revoke_access)or the[gcloud](https://cloud.google.com/iam/docs/granting-changing-revoking-access#revoking-gcloud-manual).
- [Temporarily disable](https://cloud.google.com/kms/docs/enable-disable#disable_an_enabled_key_version)the CMEK.
- [Permanently destroy](https://cloud.google.com/kms/docs/destroy-restore#schedule_a_key_version_for_destruction_destroy_a_key_version)the CMEK.

We recommend that you revoke the permissions from the Gemini Code Assist service account before disabling or destroying a key. Changes to permissions are consistent within seconds, so you can observe the impacts of disabling or destroying a key.



Gemini Code Assist on GitHub brings the power of Gemini to the pull request process by acting as a code reviewer. Gemini Code Assist on GitHub uses a Gemini-powered agent that automatically summarizes pull requests and provides in-depth code reviews, speeding up reviews and increasing the quality of code.

Once you've[set up Gemini Code Assist on GitHub](https://developers.google.com/gemini-code-assist/docs/set-up-code-assist-github), you can invoke Gemini Code Assist at any stage of the pull request to review the code. You can interact with Gemini Code Assist in the pull request comments directly by:

- Asking clarifying questions on the review that Gemini Code Assist creates.
- Prompting Gemini Code Assist by adding the`/gemini`tag to your comments to ask questions in the context of the pull request.

Gemini Code Assist will automatically retrieve helpful information from the repository and pull request to perform its tasks.

This document is intended for developers of all skill levels. It assumes that you have a working knowledge of GitHub.

## Consumer version and enterprise version

| **Important:** The enterprise version of Gemini Code Assist on GitHub is a separate and distinct product from[Gemini Code Assist Enterprise](https://developers.google.com/gemini-code-assist/docs/overview#supported-features).

Gemini Code Assist on GitHub is available in a consumer version, which you install directly in GitHub, and an enterprise version, which you install through Google Cloud.

The following table summarizes the differences between the consumer version and enterprise version:

|                                                                                                       |                       Consumer version                       |                                                                                               Enterprise version[(Preview)](https://cloud.google.com/products#product-launch-stages)                                                                                               |
|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Setup](https://developers.google.com/gemini-code-assist/docs/set-up-code-assist-github)              | Directly in GitHub                                           | Managed through Google Cloud                                                                                                                                                                                                                                                       |
| Terms of service                                                                                      | [Google terms of service](https://policies.google.com/terms) | [Google Cloud terms of service](https://cloud.google.com/terms/)                                                                                                                                                                                                                   |
| [Quotas](https://developers.google.com/gemini-code-assist/resources/quotas#github)                    | 33 pull requests per day                                     | 100+ pull requests per day                                                                                                                                                                                                                                                         |
| [Style guide](https://developers.google.com/gemini-code-assist/docs/customize-gemini-behavior-github) | Set per-repository within GitHub                             | Can be set either per-repository within GitHub or across multiple repositories from Google Cloud                                                                                                                                                                                   |
| GitHub support                                                                                        | GitHub                                                       | GitHub [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server/admin/overview/about-github-enterprise-server) [GitHub Enterprise Cloud](https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency) |

## Use Gemini Code Assist on GitHub

This section provides steps for using Gemini Code Assist on GitHub once you've completed the setup. This section applies to both consumer and enterprise versions of Gemini Code Assist on GitHub.

### Before you begin

To complete the tasks in this section, make sure you have[set up Gemini Code Assist on GitHub](https://developers.google.com/gemini-code-assist/docs/set-up-code-assist-github).

### Get pull request summary and feedback

To get an initial review for a pull request from Gemini Code Assist, create a new pull request.

When you open the new pull request, Gemini Code Assist provides an initial review. After the review is ready,`gemini-code-assist[bot]`is automatically added as a reviewer to the pull request. Gemini Code Assist adds an issue comment in the**Conversation**tab of the pull request with its feedback, and proceeds to add comments about modified portions of the code.

Review comments contain the following information:

- Severity of the issue, given as Critical, High, Medium, and Low
- Feedback on the issue
- Code suggestion that can be committed directly from GitHub
- References to a user-provided style guide

### Manually invoke Gemini Code Assist

Gemini Code Assist listens to comments from any pull request contributor, and decides whether it should respond.

To manually invoke Gemini Code Assist, you can use the following commands in the main comments page on the pull request as an issue comment.

|      Command      |                      Description                       |
|-------------------|--------------------------------------------------------|
| `/gemini summary` | Posts a summary of the changes in the pull request     |
| `/gemini review`  | Posts a code review of the changes in the pull request |
| `/gemini`         | Manually invokes Gemini Code Assist in comments        |
| `/gemini help`    | Overview of the available commands                     |

### Manage the Gemini Code Assist settings

Anyone with permissions to modify GitHub App settings for the organization can manage the Gemini Code Assist app settings. You can review the permissions provided to the Gemini Code Assist app, manage repository access, and uninstall the Gemini Code Assist app.

To modify the settings, follow these steps:

1. On GitHub, click your profile photo and then click**Settings**.
2. In the**Integrations** section, click**Applications**. A list of GitHub Apps is displayed.
3. Beside Gemini Code Assist, click**Configure**.

## What's next

- [Set up Gemini Code Assist on GitHub](https://developers.google.com/gemini-code-assist/docs/set-up-code-assist-github).
- Learn how to[customize Gemini Code Assist on GitHub behavior](https://developers.google.com/gemini-code-assist/docs/customize-gemini-behavior-github).



This page shows you how to set up[Gemini Code Assist on GitHub](https://developers.google.com/gemini-code-assist/docs/review-github-code), a Gemini-powered agent that automatically summarizes pull requests and provides in-depth code reviews.

## Before you begin

To set up Gemini Code Assist on GitHub, make sure you do the following:

- Have a GitHub organization or personal account.

  | **Note:** The consumer version of Gemini Code Assist on GitHub doesn't support organizations that enable private connectivity.
- Have one or more GitHub repositories that you want to enable Gemini Code Assist on GitHub on.

  - If you don't have such a repository, you can create a fork of[our sample repository](https://github.com/GoogleCloudPlatform/microservices-demo)to use.
- If you are setting up the[enterprise version](https://developers.google.com/gemini-code-assist/docs/review-github-code#versions)of Gemini Code Assist on GitHub, you must have appropriate IAM roles in order to complete the setup within Google Cloud.

  - Ask your administrator to[grant](https://cloud.google.com/iam/docs/granting-changing-revoking-access)you the[**Service Usage Admin**role](https://cloud.google.com/iam/docs/roles-permissions/serviceusage#serviceusage.serviceUsageAdmin)and the`geminicodeassistmanagement.scmConnectionAdmin`role.

    | **Important:** The`geminicodeassistmanagement.scmConnectionAdmin`role can't be granted using the Google Cloud console. Use the Google Cloud CLI instead.
  - Alternatively, if you have the[**Admin** or**Owner**basic roles](https://cloud.google.com/iam/docs/roles-overview#basic), you have the necessary IAM permissions to complete the setup for the enterprise version.

## Install Gemini Code Assist on GitHub

The following steps show you how to set up Gemini Code Assist on GitHub. Click the relevant tab for the version you want to set up, either the[consumer version or enterprise version](https://developers.google.com/gemini-code-assist/docs/review-github-code#versions).  

### Consumer

1. Go to the[Gemini Code Assist](https://github.com/apps/gemini-code-assist)app page.

2. Sign in to your GitHub account if you haven't already.

3. Click**Install**.

   A prompt to install the Gemini Code Assist app for a user or organization is displayed.
4. When prompted to install the Gemini Code Assist app for a user or organization, select the organization you intend to use it on.

   After you've installed the Gemini Code Assist app for your GitHub organization, you're prompted to select the repositories to enable the Code Review integration.

   You're redirected to the Admin Console for the Gemini Code Assist app.
5. Login with your GitHub account.

6. Select a GitHub organization or personal account from the drop-down menu.

7. Review and accept the Google Terms of Service, Generative AI Prohibited Use Policy and Privacy Policy, and then click**Complete setup**.

   Gemini Code Assist is added to the pull requests within your selected repositories.

After creation, Gemini Code Assist provides suggestions to your code review every time the pull request author or other human reviewers add comments with the`/gemini`tag on the pull request.

Gemini Code Assist is now active for all the pull requests within your selected repositories.

### Enterprise

| **Preview**
|
| This feature is subject to the "Pre-GA Offerings Terms" in the General Service Terms section of the[Service Specific Terms for Google Cloud](https://cloud.google.com/terms/service-terms#1). Pre-GA features are available "as is" and might have limited support. For more information, see the[Google Cloud launch stage descriptions](https://cloud.google.com/products/#product-launch-stages).

1. In the Google Cloud console, go to the Gemini Code Assist**Agents \& Tools**page.

   [Go to Agents \& Tools](https://console.cloud.google.com/gemini-code-assist/agents-tools)
   1. If you haven't previously enabled the Developer Connect API, you see a caution banner that prompts you to enable the API. If this happens, click the**Enable** button associated with the banner, and click the**Enable**button in the dialog window that appears.
2. In the**Agents** section, locate the**Code Assist Source Code Management** card, and click**Enable**.

   The**Enable Code Assist Source Code Management**pane opens.
3. In the**Gemini Code Assist Management API** section, click**Enable**.

4. In the**Select a connection** section, click the**Connection**drop-down.

5. In the drop-down, click**Create new connection**.

   The**Link Git repositories via Developer Connect**pane opens.
6. In the**Provider**drop-down, select the GitHub provider you are using.

7. In the**Name**field, enter a name for your connection.

8. Click**Continue**.

   The**Request GitHub OAuth token**dialog window open.
9. After reading the disclaimer, click**I understand and continue**.

10. In the**Install Gemini Code Assist**page, click the account you want to install the app in.

11. Choose whether to install the app for**All repositories** or**Only select repositories**.

12. Click**Install**.

13. Follow the GitHub steps to authenticate to GitHub.

    Once access is confirmed, the dialog window closes and you return to the**Link Git repositories via Developer Connect**pane.
14. In the**Link repositories** section, click the**Repositories** drop-down, select the repositories you want to link, and click**Ok**.

    | **Note:** If you create a new GitHub repository in the future and want to add it to the linked repositories in your connection, you must[use Developer Connect](https://cloud.google.com/developer-connect/docs/connect-github-repo#link-repos)to do so.
15. Click**Link**.

16. In the**Select a connection**drop-down, select the connection you created.

17. Click**Done**.

Gemini Code Assist is now active for all the pull requests within your selected repositories.

## What's next

- [Use Gemini Code Assist in GitHub](https://developers.google.com/gemini-code-assist/docs/review-github-code#before-you-begin).
- Learn how to[customize Gemini Code Assist on GitHub behavior](https://developers.google.com/gemini-code-assist/docs/customize-gemini-behavior-github).





If you have a custom set of best practices or conventions that you want[Gemini Code Assist on GitHub](https://developers.google.com/gemini-code-assist/docs/review-github-code)to check for, you can add a`styleguide.md`file to the`.gemini/`root folder of your repository. Users of the[enterprise version](https://developers.google.com/gemini-code-assist/docs/review-github-code#versions)of Gemini Code Assist on GitHub can use the Google Cloud console to add style guide information for use across multiple repositories. In both cases, the style guide is treated as a regular Markdown file, and expands the standard prompt that Gemini Code Assist on GitHub uses. For instructions on adding a style guide, see[add configuration files](https://developers.google.com/gemini-code-assist/docs/customize-gemini-behavior-github#add-configuration-files).

## Standard code review patterns

When custom style guides aren't specified, these are the main categories of areas where Gemini Code Assist focuses its code review on:

- **Correctness**: Makes sure the code functions as intended and handles edge cases, checks for logic errors, race conditions, or incorrect API usage.

- **Efficiency**: Identifies potential performance bottlenecks or areas for optimization, like excessive loops, memory leaks, inefficient data structures, redundant calculations, excessive logging, and inefficient string manipulation.

- **Maintainability**: Assesses code readability, modularity, and adherence to language idioms and best practices. Targets poor naming for variables, functions, and classes, lack of comments or documentation, complex code, code duplication, inconsistent formatting, and magic numbers.

- **Security**: Identifies potential vulnerabilities in data handling or input validation, like insecure storage of sensitive data, injection attacks, insufficient access controls, Cross-Site Request Forgery (CSRF), and Insecure Direct Object References (IDOR).

- **Miscellaneous**: Other topics are considered when reviewing the pull request, like testing, performance, scalability, modularity and reusability, and error logging and monitoring.

## Add configuration files

You can modify Gemini Code Assist behavior by adding supported configuration files to a`.gemini/`folder located in the root of your repository. Gemini Code Assist uses the following files, if you've added them to the`.gemini/`folder:

- `config.yaml`: A file that contains various configurable features that you can enable or disable, including specifying files to ignore using[glob patterns](https://code.visualstudio.com/docs/editor/glob-patterns).

- `styleguide.md`: A Markdown file which instructs Gemini Code Assist with some specific rules that you want it to follow when performing a code review.

### `config.yaml`example

The following code snippet is an example of a`config.yaml`file. In this example, each property is set to the default value used by Gemini Code Assist. You can use this snippet as a template to create your own`config.yaml`file:  

    have_fun: false
    memory_config:
      disabled: false
    code_review:
      disable: false
      comment_severity_threshold: MEDIUM
      max_review_comments: -1
      pull_request_opened:
        help: false
        summary: true
        code_review: true
        include_drafts: true
    ignore_patterns: []

### `config.yaml`schema

The following code snippet is the schema for the`config.yaml`file. It defines all of the possible configuration options and their accepted values:  

```yaml
$schema: "http://json-schema.org/draft-07/schema#"
title: RepoConfig
description: Configuration for Gemini Code Assist on a repository. All fields are optional and have default values.
type: object
properties:
  have_fun:
    type: boolean
    description: Enables fun features such as a poem in the initial pull request summary. Default: false.
  ignore_patterns:
    type: array
    items:
      type: string
    description: A list of glob patterns for files and directories that Gemini Code Assist should ignore. Files matching any pattern in this list will be skipped during interactions. Default: [].
  memory_config:
    type: object
    description: Configuration for persistent memory, which is used to improve responses.
    properties:
      disabled:
        type: boolean
        description: Whether to disable persistent memory for this specific repository, if persistent memory https://developers.google.com/gemini-code-assist/docs/customize-gemini-behavior-github#bulk-config. Default: false.
  code_review:
    type: object
    description: Configuration for code reviews. All fields are optional and have default values.
    properties:
      disable:
        type: boolean
        description: Disables Gemini from acting on pull requests. Default: false.
      comment_severity_threshold:
        type: string
        enum:
          - LOW
          - MEDIUM
          - HIGH
          - CRITICAL
        description: The minimum severity of review comments to consider. Default: MEDIUM.
      max_review_comments:
        type: integer
        format: int64
        description: The maximum number of review comments to consider. Use -1 for unlimited. Default: -1.
      pull_request_opened:
        type: object
        description: Configuration for pull request opened events. All fields are optional and have default values.
        properties:
          help:
            type: boolean
            description: Posts a help message on pull request open. Default: false.
          summary:
            type: boolean
            description: Posts a pull request summary on the pull request open. Default: true.
          code_review:
            type: boolean
            description: Posts a code review on pull request open. Default: true.
          include_drafts:
            type: boolean
            description: Enables agent functionality on draft pull requests. Default: true.
```

### `styleguide.md`

The`styleguide.md`file does not have a defined schema. Instead, it's a natural language description of how you want Gemini Code Assist to structure its code reviews. The following code snippet is an example of a`styleguide.md`file:  

    # Company X Python Style Guide

    # Introduction
    This style guide outlines the coding conventions for Python code developed at Company X.
    It's based on PEP 8, but with some modifications to address specific needs and
    preferences within our organization.

    # Key Principles
    * **Readability:** Code should be easy to understand for all team members.
    * **Maintainability:** Code should be easy to modify and extend.
    * **Consistency:** Adhering to a consistent style across all projects improves
      collaboration and reduces errors.
    * **Performance:** While readability is paramount, code should be efficient.

    # Deviations from PEP 8

    ## Line Length
    * **Maximum line length:** 100 characters (instead of PEP 8's 79).
        * Modern screens allow for wider lines, improving code readability in many cases.
        * Many common patterns in our codebase, like long strings or URLs, often exceed 79 characters.

    ## Indentation
    * **Use 4 spaces per indentation level.** (PEP 8 recommendation)

    ## Imports
    * **Group imports:**
        * Standard library imports
        * Related third party imports
        * Local application/library specific imports
    * **Absolute imports:** Always use absolute imports for clarity.
    * **Import order within groups:**  Sort alphabetically.

    ## Naming Conventions

    * **Variables:** Use lowercase with underscores (snake_case): `user_name`, `total_count`
    * **Constants:**  Use uppercase with underscores: `MAX_VALUE`, `DATABASE_NAME`
    * **Functions:** Use lowercase with underscores (snake_case): `calculate_total()`, `process_data()`
    * **Classes:** Use CapWords (CamelCase): `UserManager`, `PaymentProcessor`
    * **Modules:** Use lowercase with underscores (snake_case): `user_utils`, `payment_gateway`

    ## Docstrings
    * **Use triple double quotes (`"""Docstring goes here."""`) for all docstrings.**
    * **First line:** Concise summary of the object's purpose.
    * **For complex functions/classes:** Include detailed descriptions of parameters, return values,
      attributes, and exceptions.
    * **Use Google style docstrings:** This helps with automated documentation generation.
        ```python
        def my_function(param1, param2):
            """Single-line summary.

            More detailed description, if necessary.

            Args:
                param1 (int): The first parameter.
                param2 (str): The second parameter.

            Returns:
                bool: The return value. True for success, False otherwise.

            Raises:
                ValueError: If `param2` is invalid.
            """
            # function body here
        ```

    ## Type Hints
    * **Use type hints:**  Type hints improve code readability and help catch errors early.
    * **Follow PEP 484:**  Use the standard type hinting syntax.

    ## Comments
    * **Write clear and concise comments:** Explain the "why" behind the code, not just the "what".
    * **Comment sparingly:** Well-written code should be self-documenting where possible.
    * **Use complete sentences:** Start comments with a capital letter and use proper punctuation.

    ## Logging
    * **Use a standard logging framework:**  Company X uses the built-in `logging` module.
    * **Log at appropriate levels:** DEBUG, INFO, WARNING, ERROR, CRITICAL
    * **Provide context:** Include relevant information in log messages to aid debugging.

    ## Error Handling
    * **Use specific exceptions:** Avoid using broad exceptions like `Exception`.
    * **Handle exceptions gracefully:** Provide informative error messages and avoid crashing the program.
    * **Use `try...except` blocks:**  Isolate code that might raise exceptions.

    # Tooling
    * **Code formatter:**  [Specify formatter, e.g., Black] - Enforces consistent formatting automatically.
    * **Linter:**  [Specify linter, e.g., Flake8, Pylint] - Identifies potential issues and style violations.

    # Example
    ```python
    """Module for user authentication."""

    import hashlib
    import logging
    import os

    from companyx.db import user_database

    LOGGER = logging.getLogger(__name__)

    def hash_password(password: str) -> str:
      """Hashes a password using SHA-256.

      Args:
          password (str): The password to hash.

      Returns:
          str: The hashed password.
      """
      salt = os.urandom(16)
      salted_password = salt + password.encode('utf-8')
      hashed_password = hashlib.sha256(salted_password).hexdigest()
      return f"{salt.hex()}:{hashed_password}"

    def authenticate_user(username: str, password: str) -> bool:
      """Authenticates a user against the database.

      Args:
          username (str): The user's username.
          password (str): The user's password.

      Returns:
          bool: True if the user is authenticated, False otherwise.
      """
      try:
          user = user_database.get_user(username)
          if user is None:
              LOGGER.warning("Authentication failed: User not found - %s", username)
              return False

          stored_hash = user.password_hash
          salt, hashed_password = stored_hash.split(':')
          salted_password = bytes.fromhex(salt) + password.encode('utf-8')
          calculated_hash = hashlib.sha256(salted_password).hexdigest()

          if calculated_hash == hashed_password:
              LOGGER.info("User authenticated successfully - %s", username)
              return True
          else:
              LOGGER.warning("Authentication failed: Incorrect password - %s", username)
              return False
      except Exception as e:
          LOGGER.error("An error occurred during authentication: %s", e)
          return False
    ```

### Manage configurations across multiple repositories

Some aspects of Gemini Code Assist on GitHub can be managed across multiple repositories:

- If you have the consumer version, you can toggle certain settings for all repositories that are associated with an account.

- If you have the enterprise version, you can toggle certain settings for multiple repositories, and you can have one style guide apply to multiple repositories. Repositories are grouped by a Developer Connect connection, and managing their collective settings and style guide is accomplsihed through the Google Cloud console.

If a repository is managed as part of a group but also has its own`config.yaml`or`styleguide.md`, the following behavior occurs:

- The repository's`config.yaml`settings override the group settings.

  - The**Improve response quality** setting can't be enabled from the`config.yaml`file; this setting can only be enabled from the group settings. However, a repository's`config.yaml`file can be set to disable the**Improve response quality**setting, which takes precedence over any group setting.
- The repository's`styleguide.md`is combined with the group style guide.

The following steps show how to control one set of configurations and, for users of the enterprise version, one style guide, across multiple repositories. These steps assume you have previously[set up Gemini Code Assist on GitHub](https://developers.google.com/gemini-code-assist/docs/set-up-code-assist-github).  

### Consumer

1. In Gemini Code Assist, go to the**Code review**page.

   [Go to code review](https://codeassist.google/code-review)
2. If prompted, click**Log in with GitHub**and follow the prompts to sign in to GitHub from within Gemini Code Assist.

3. In the**Gemini** page, select the account you want to work with, review the terms of service, and click**Continue**.

4. In the**Free agent**page, update the settings as needed.

5. Click**Save**.

### Enterprise

| **Preview**
|
| This feature is subject to the "Pre-GA Offerings Terms" in the General Service Terms section of the[Service Specific Terms for Google Cloud](https://cloud.google.com/terms/service-terms#1). Pre-GA features are available "as is" and might have limited support. For more information, see the[Google Cloud launch stage descriptions](https://cloud.google.com/products/#product-launch-stages).

1. In the Google Cloud console, go to the Gemini Code Assist**Agents \& Tools**page.

   [Go to Agents \& Tools](https://console.cloud.google.com/gemini-code-assist/agents-tools)
2. In the**Agents** section, locate the**Code Assist Source Code Management** card, and click**Advanced**.

   The**Edit Code Assist Source Code Management**pane opens.
3. In the**Connections**table, click the name of the connection that you want to apply a configuration or style guide to.

   The details page for the connection opens.
4. In the**Settings**tab, update the settings that you want to change.

5. In the**Style guide**tab, add the style guide you want the repositories associated with this connection to use.

6. Click**Save**.





Gemini Code Assist provides AI-powered assistance to help your development team build, deploy, and operate applications throughout the software development lifecycle.

This page provides an overview of the keyboard shortcuts you can use in VS Code, IntelliJ, and[other supported JetBrains IDEs](https://developers.google.com/gemini-code-assist/docs/supported-languages#supported_ides), for Windows, Linux, and macOS users.

## Code generation shortcuts

### VS Code

|                                                                           Action                                                                            | Keyboard shortcut (Windows/Linux) | Keyboard shortcut (macOS) |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|---------------------------|
| Navigate to chat interface                                                                                                                                  | <kbd>Alt+G</kbd>                  | <kbd>Option+G</kbd>       |
| [Add selected code snippet to Gemini Chat context](https://developers.google.com/gemini-code-assist/docs/chat-gemini#add_selected_code_snippets_to_context) | <kbd>Control+Alt+X</kbd>          | <kbd>Command+Alt+X</kbd>  |

### IntelliJ

|                                                                           Action                                                                            | Keyboard shortcut (Windows/Linux) | Keyboard shortcut (macOS) |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|---------------------------|
| Generate code inline of a code file                                                                                                                         | <kbd>Control+G</kbd>              | Option+G                  |
| Open In-Editor prompt                                                                                                                                       | <kbd>Control+\</kbd>              | <kbd>Command+\</kbd>      |
| [Add selected code snippet to Gemini Chat context](https://developers.google.com/gemini-code-assist/docs/chat-gemini#add_selected_code_snippets_to_context) | <kbd>Control+Alt+X</kbd>          | <kbd>Command+Alt+X</kbd>  |

## Terminal shortcuts

### VS Code

|                                                                                            Action                                                                                            | Keyboard shortcut (Windows/Linux) | Keyboard shortcut (macOS) |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|---------------------------|
| [Add the current highlighted terminal content to the Gemini Chat context](https://developers.google.com/gemini-code-assist/docs/chat-gemini#prompt_with_selected_terminal_output_using_chat) | <kbd>Control+Alt+X</kbd>          | <kbd>Command+Alt+X</kbd>  |

### IntelliJ

There aren't any default terminal shortcuts for Gemini Code Assist for IntelliJ and other supported JetBrains IDEs at this time.

## Chat shortcuts

### VS Code

|              Action              | Keyboard shortcut (Windows/Linux) | Keyboard shortcut (macOS) |
|----------------------------------|-----------------------------------|---------------------------|
| Cycle through prior chat prompts | <kbd>Up/down arrows</kbd>         | <kbd>Up/down arrows</kbd> |

### IntelliJ

|              Action              | Keyboard shortcut (Windows/Linux) |     Keyboard shortcut (macOS)     |
|----------------------------------|-----------------------------------|-----------------------------------|
| Cycle through prior chat prompts | <kbd>Up/down arrows</kbd>         | <kbd>Up/down arrows</kbd>         |
| New chat                         | <kbd>Control+Alt+Windows+Up</kbd> | <kbd>Control+Alt+Command+Up</kbd> |

## Edit keyboard shortcuts

If you prefer to change any of the default Gemini Code Assist shortcuts, you can do so by following these steps:  

### VS Code

1. In your IDE, click**File** (for Windows and Linux) or**Code** (for macOS), and then navigate to**Settings** \>**Keyboard Shortcuts**.

2. In the list of keyboard shortcuts, scroll until you find the shortcut that you want to change. For example:**Gemini Code Assist: Generate code**.

3. Click the shortcut that you want to change (for example,**Gemini Code Assist: Generate Code** ), and then clickedit**Change Keybinding**.

4. In the dialog that appears, enter your own shortcut.

5. Press<kbd>Enter</kbd>(for Windows and Linux) or<kbd>Return</kbd>(for macOS).

   You can now use your newly assigned keyboard shortcut in your IDE.

To learn more about changing shortcuts in your IDE, see[Keybindings for Visual Studio Code](https://code.visualstudio.com/docs/getstarted/keybindings).

### IntelliJ

1. Navigate tosettings**IDE and Project Settings** \>**Settings** \>**Keymap** \>**Plugins** \>**Gemini Code Assist**.

2. Right-click the shortcut you want to change (for example,**Generate Code** ) and select**Add Keyboard Shortcut**.

3. Enter your preferred keyboard shortcut and then click**OK**.

4. Right-click the shortcut again and remove the shortcut. For example, right-click**Generate code** and select**Remove<kbd>Alt+G</kbd>** (for Windows and Linux), or**Remove<kbd>Option+G</kbd>**(for macOS).

You can now use your new keyboard shortcut in your IDE.


<br />

Gemini Code Assist supports excluding files from your context for code generation, code completion, code transformation, and chat. For Enterprise users, this also includes code customization.

In many scenarios, you'll have specific files or subtrees that you don't want to have included in your context.

You can exclude these files through the use of an`.aiexclude`or`.gitignore`file.
| **Note:** For[code customization](https://developers.google.com/gemini-code-assist/docs/code-customization-overview)only the`.aiexclude`file is used.

## Configure context exclusion settings

This section shows you how to configure settings for`.aiexclude`and`.gitignore`files.

### Change .aiexclude file to your preferred file

By default, context exclusion is set to use`.aiexclude`. To change this setting in your IDE, follow these steps:  

### VS Code

1. In the activity bar, clicksettings**Manage** \>**Settings**.

2. In the**Settings** window, navigate to**Extensions** \>**Gemini Code Assist** . Scroll until you find**Context Exclusion File**.

3. In the text field, change`.aiexclude`to your preferred location.

Your preferred file is now set as the context exclusion file.

### IntelliJ

Configuring settings for`.aiexclude`and`.gitignore`files isn't supported in JetBrains IDEs.

### Change .gitignore context exclusion

By default, the`.gitignore`file is enabled for context exclusion. The file must be located in the root working folder for Gemini Code Assist.`.gitignore`files located in subdirectories won't be considered or merged.

To disable`.gitignore`files from context exclusion, follow these steps:

1. In the activity bar, clicksettings**Manage** \>**Settings**.

2. In the**Settings** window, navigate to**Extensions** \>**Gemini Code Assist** . Scroll until you find**Context Exclusion Gitignore**.

3. Unselect the checkbox.

   `.gitignore`files are now disabled for specifying file Gemini Code Assist to ignore.

## Write an`.aiexclude`file

| **Note:** In the event that a conflict exists between`.aiexclude`and`.gitignore`, the`.aiexclude`directive preempts`.gitignore`directives.

An`.aiexclude`file follows the same syntax as a`.gitignore`file.

### Examples

The following examples demonstrate how you can configure an`.aiexclude`file:

- Block all files named`apikeys.txt`at or below the directory that contains the`.aiexclude`file:

      apikeys.txt

- Block all files with the`.key`file extension at or below the directory that contains the`.aiexclude`file:

      *.key

- Block only the`apikeys.txt`file at the same directory as the`.aiexclude`file, but not any subdirectories:

      /apikeys.txt

- Block all files in the directory`my/sensitive/dir`and all subdirectories. The path should be relative to the directory that contains the`.aiexclude`file.

      my/sensitive/dir/

- Blocks all the files in directory`foo`and its subdirectories except file named`bar.txt`in the foo directory.

      foo/*
      !foo/bar.txt

## Control access to index for code customization

By default, code customization indexes all the[supported code files](https://developers.google.com/gemini-code-assist/docs/code-customization-overview#limitations)in your specified repositories.

To prevent exposure of code that you don't want to be used in the context, you can use branch patterns to[control access to your index](https://developers.google.com/gemini-code-assist/docs/code-customization#control_access_to_your_index_using_repository_groups)and use a stable branch, such as`main`.

Alternatively, you can also exclude files from the context by[creating an`.aiexclude`file](https://developers.google.com/gemini-code-assist/docs/create-aiexclude-file#write_an_aiexclude_file).





| **Preview**
|
| Specifying folders to use as context with Gemini Code Assist is a feature that is in preview. Products and features that are in preview are available "as is".

Local codebase awareness improves the relevance of Gemini Code Assist responses through indexing and supporting techniques.

By default, local codebase awareness is enabled. To disable local codebase awareness, perform the following tasks:  

### VS Code

1. In your IDE, navigate to**Settings** \>**Extensions** \>**Gemini Code Assist**.

2. Search for the**Local Codebase Awareness**setting.

3. Unselect the checkbox to disable local codebase awareness.

4. Reload your IDE.

### IntelliJ

Local codebase awareness configuration settings aren't supported in Gemini Code Assist for IntelliJ and other JetBrains IDEs.




This page describes how to use pre-release features of Gemini Code Assist for VS Code on the insiders release channel.

Pre-release builds can include bug fixes and features still in development that might be removed in a future release.

## Before you begin

Set up the edition of Gemini Code Assist you want to use in your IDE:

- [Gemini Code Assist for individuals](https://developers.google.com/gemini-code-assist/docs/set-up-gemini)
- [Gemini Code Assist Standard or Enterprise](https://developers.google.com/gemini-code-assist/docs/set-up-gemini-standard-enterprise)

## Use the insiders build

To configure the update channel, follow these steps:

1. In your IDE, open the**Command palette** (`Cmd`+`Shift`+`P`) and then select**Open User Settings JSON**.
2. Add the following line to your user settings JSON:`"geminicodeassist.updateChannel": "Insiders",`
3. Save your user settings.

You are prompted to reload your window to use the latest insiders build.

## Use the standard release channel

To use the standard release channel instead of the insiders build, follow these steps:

1. In your IDE, open the**Command palette** (`Cmd`+`Shift`+`P`) and then select**Open User Settings JSON**.
2. Comment out or remove the following line of your user settings JSON:`"geminicodeassist.updateChannel": "Insiders",`
3. Save your user settings.

You are prompted to reload your window to use the standard release channel.




This document provides instructions for network administrators to configure their networks to restrict access to Gemini Code Assist based on user domains. This feature lets organizations control which users within their network can utilize Gemini Code Assist, enhancing security and preventing unauthorized access.

## Overview

You can configure Gemini Code Assist to enforce user domain restrictions using the custom HTTP header`X-GeminiCodeAssist-Allowed-Domains`. This header specifies a list of allowed domains, and the Gemini Code Assist backend only processes requests from users whose authenticated domain matches one of the allowed domains.

You can use a Person-in-the-Middle (PITM) proxy approach to insert this header into requests made to Gemini Code Assist that originate within your network.

## Configure a proxy in your IDE

To configure a proxy in your IDE, follow these steps:  

### VS Code

1. Navigate to**File** \>**Settings** (for Windows), or**Code** \>**Settings** \>**Settings**(for macOS).

2. In the**User** tab, navigate to**Application** \>**Proxy**.

3. In the box under**Proxy** , enter the address of your proxy server. For example`http://localhost:3128`.

4. Optional: To configure Gemini Code Assist to ignore certificate errors, under**Proxy Strict SSL**, select or deselect the checkbox. This setting applies to all profiles.

### IntelliJ

1. Navigate to**File** \>**Settings** (for Windows) or**IntelliJ IDEA** \>**Settings**(for macOS).

2. Navigate to**Appearance \& Behavior** \>**System Settings** \>**HTTP Proxy**.

3. Select**Manual proxy configuration** , and then select**HTTP**.

4. In the**Host name**field, enter the hostname of your proxy server.

5. In the**Port number**field, enter the port number of your proxy server.

6. Optional: To configure Gemini Code Assist to ignore certificate errors, in the sidebar, click**Tools** \>**Server Certificates** and then select or deselect**Accept non-trusted certificates automatically**.

## Configure PITM proxy

To configure your PITM proxy, follow these steps:

1. Make sure your network utilizes a PITM proxy capable of intercepting and modifying HTTPS traffic.

2. Configure the proxy to intercept all outgoing requests to the Gemini Code Assist endpoint (`https://cloudcode-pa.googleapis.com`). Don't use wildcards (`*`) when you specify the Gemini Code Assist endpoint.

3. Configure the proxy to inject the`X-GeminiCodeAssist-Allowed-Domains`header into each request. The header should contain a comma-separated list of allowed domains (e.g.,`example.com`,`yourcompany.net`). Make sure that domain names are separated by commas and don't include the`@`symbol.

   If headers aren't resolved into at least one valid domain, restrictions won't apply. For example, an empty header won't apply any restrictions.`domain`won't apply any restrictions as it isn't a valid domain name.

When a user tries to access Gemini Code Assist from a domain not included in the header list, they see a message telling them that they're restricted from using Gemini Code Assist on their domain by their administrator.

## SSL/TLS interception

If your proxy needs to decrypt HTTPS traffic to inject the header, make sure it's configured for SSL/TLS interception. This typically involves:

- Generating a certificate for the proxy.

- Installing the proxy's certificate on user devices to establish trust and avoid certificate errors.

## Header validation

- Gemini Code Assist automatically validates the`X-GeminiCodeAssist-Allowed-Domains`header and enforces the restrictions.

- If the header doesn't resolve to at least one valid domain, the validation won't be performed.

- If the domain associated with the user's authentication isn't in the allowed list, the request is rejected. For example if the user logs in with a gmail account and only example.com is on the allowed list, the request is rejected.

## What's next

To learn more about blocking access to consumer accounts, see[Block access to consumer accounts](https://support.google.com/a/answer/1668854).