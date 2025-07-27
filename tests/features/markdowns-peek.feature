Feature: MarkdownsPeek Library Initialization

  As a developer
  I want to initialize the MarkdownsPeek library
  So that I can view GitHub markdown files in my web application

  Scenario: Successfully initialize MarkdownsPeek with default configuration
    Given I have a container element in the DOM
    When I initialize MarkdownsPeek with default options
    Then the library should be properly initialized
    And the container should have the correct CSS classes
    And the initial loader should be displayed 