# Hybrid UI & API Automation Framework

## Overview

This repository contains a scalable, enterprise-ready **UI and API Automation Framework** built using **Java, Selenium WebDriver, TestNG, Rest Assured, and Maven**.

The framework is designed with clean architecture, reusable components, and industry-standard design patterns to support maintainable, thread-safe, and extensible automated testing for both **Web UI** and **REST APIs**.

### Key Capabilities

- UI Automation using Selenium WebDriver
- REST API Automation using Rest Assured
- Cross-browser execution
- Parallel execution using ThreadLocal
- Environment-driven configuration
- Page Object Model (POM)
- Client-based API architecture
- Extent Reports with screenshots
- Centralized logging
- Custom assertion utilities (Hard & Soft Assertions)
- GitHub Actions CI support
- Scalable and reusable framework components

---

# Tech Stack

| Technology | Purpose |
|------------|---------|
| Java 17 | Programming Language |
| Selenium WebDriver | Web UI Automation |
| Rest Assured | REST API Automation |
| TestNG | Test Execution Framework |
| Maven | Build & Dependency Management |
| Extent Reports | Reporting |
| SLF4J + Logback | Logging |
| WebDriverManager | Driver Management |
| GitHub Actions | Continuous Integration |
| Git & GitHub | Version Control |

---

# Framework Design

## Design Patterns Implemented

- Page Object Model (POM)
- Singleton Pattern
- Factory Pattern
- ThreadLocal Pattern
- Utility Layer Abstraction
- Client Layer Pattern (API)
- Base Test Architecture
- Wrapper Design Pattern (Actions & Assertions)

---

## Project Structure

```text
src
│
├── test
│   └── java
│       └── com
│           └── selenium
│               └── testng
│                   ├── api
│                   │   ├── base
│                   │   ├── clients
│                   │   └── tests
│                   └── base
│                   │   ├── BaseTest
│                   └── config
│                   └── context
│                   └── enums
│                   └── listeners
│                   └── utils
│                   ├── web
│                   │   ├── base
│                   │   ├── driverfactory
│                   │   ├── locators
│                   │   ├── pages
│                   │   └── tests
│   └── resources
│       └── suites
│

```

---

# Framework Features

## Web Automation

- Selenium WebDriver
- Page Object Model (POM)
- Dynamic locator support
- Multi-parameter XPath builder
- Wrapper methods for Selenium actions
- JavaScript utility methods
- Cross-browser execution
- Explicit wait utilities
- Thread-safe WebDriver management

---

## API Automation

- Rest Assured integration
- Client-based API architecture
- Base API setup
- Reusable Request Specification
- API request and response logging
- Environment-based API URLs
- API key configuration
- JSONPath validation
- Response parsing
- Extensible API client model

---

## Assertion Framework

Custom Assertion Utility supporting both UI and API validations.

### Hard Assertions

- assertEquals()
- assertTrue()
- assertFalse()
- fail()
- Status Code Validation
- JSONPath Validation
- Response Time Validation
- Response Body Validation

### Soft Assertions

- softAssertEquals()
- softAssertNotEquals()
- softAssertTrue()
- softAssertFalse()
- softAssertStatusCode()
- softAssertJsonPathEquals()
- assertAll()

Each assertion automatically logs results into **Extent Reports**.

---

## Logging

Centralized logging using **SLF4J + Logback**.

### Features

- Thread-safe execution logs
- Separate execution log generated for every execution
- UI execution logging
- API request logging
- API response logging
- Automatic log artifact generation for CI/CD

---

## Reporting

Integrated **Extent Reports** with:

- Test execution summary
- Pass / Fail logging
- Screenshot capture on failures
- Browser information
- Environment information
- Categorized execution results

---

## Parallel Execution

Thread-safe execution using **ThreadLocal** for:

- WebDriver
- Test Context
- Extent Reports
- Soft Assertions

### Benefits

- Faster execution
- Improved scalability
- No shared state between tests
- Safe parallel execution

---

## Dynamic Locator Framework

Supports reusable dynamic locators with multiple runtime parameters.

Example:

```java
By locator = LocatorUtil.xpath(
        USER_ACTION,
        "John Smith",
        "Delete");
```

Supports:

- Single dynamic values
- Multiple dynamic values
- Reusable XPath templates

---

## Environment Support

Supports execution against multiple environments using runtime parameters.

Example:

```bash
mvn clean test -Dbrowser=chrome -Denv=qa
```

Configuration is managed centrally through **ConfigManager**.

---

## CI/CD Ready

GitHub Actions workflow included with support for:

- Maven execution
- TestNG Suite execution
- Extent Report artifact upload
- Execution Log artifact upload

---

# Sample Execution

### Run all tests

```bash
mvn clean test
```

### Run all tests with TestNG suite

```bash
mvn clean test -DsuiteXmlFile=src/test/resources/suites/testNG.xml
```

### Run on Chrome

```bash
mvn clean test -Dbrowser=chrome
```

### Run against QA environment

```bash
mvn clean test -Denv=qa
```

### Run API Smoke Tests

```bash
mvn clean test -DsuiteXmlFile=src/test/resources/suites/api-smoke.xml
```

---

# Framework Highlights

- Enterprise-style automation framework architecture
- Hybrid UI + API automation
- Thread-safe execution using ThreadLocal
- Dynamic locator strategy
- Wrapper-based Selenium actions
- Wrapper-based assertion utilities
- Centralized configuration management
- Reusable API Client architecture
- Environment-driven execution
- Extent Reports integration
- SLF4J + Logback logging
- GitHub Actions CI integration
- Easily extendable for future enhancements

---

# Future Enhancements

- Docker execution
- Selenium Grid
- BrowserStack / LambdaTest integration
- API schema validation
- Database validation layer
- OAuth/JWT authentication support
- AI-assisted execution analysis
- Self-healing locators
- Playwright module
- Performance testing integration (JMeter / Gatling)

---

# Author

## Arzoo Hingorani

**Senior QA Automation Engineer | SDET**

### Core Skills

- Java
- Selenium WebDriver
- Rest Assured
- TestNG
- Maven
- API Testing
- SQL
- Automation Framework Design
- GitHub Actions
- CI/CD
