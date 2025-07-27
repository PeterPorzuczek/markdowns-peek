Feature: MarkdownsPeek Custom Configuration

  As a developer
  I want to initialize the MarkdownsPeek library with custom options
  So that I can customize the appearance and behavior

  Scenario: Initialize MarkdownsPeek with custom configuration
    Given I have a container element in the DOM
    When I initialize MarkdownsPeek with custom options
    Then the library should be initialized with custom configuration
    And the container should have custom CSS classes
    And no styles should be injected when disableStyles is true 