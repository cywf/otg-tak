# Contributing to OTG-TAK

Thank you for your interest in contributing to OTG-TAK! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professional communication

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/otg-tak.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker and Docker Compose
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/cywf/otg-tak.git
cd otg-tak

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt
uvicorn main:app --reload

# Frontend setup (in another terminal)
cd frontend
npm install
npm run dev
```

## Project Structure

```
otg-tak/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/      # API endpoints
│   │   ├── core/     # Core configuration
│   │   ├── models/   # Database models
│   │   └── services/ # Business logic
│   └── main.py
├── frontend/          # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── ansible/           # Ansible playbooks
├── terraform/         # Terraform modules
└── docs/             # Documentation
```

## Coding Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions and classes
- Maximum line length: 100 characters

```python
def create_deployment(deployment_id: int, config: Dict[str, Any]) -> bool:
    """
    Create a new deployment with the specified configuration.
    
    Args:
        deployment_id: Unique identifier for the deployment
        config: Deployment configuration dictionary
        
    Returns:
        bool: True if deployment created successfully
    """
    pass
```

### JavaScript/React (Frontend)

- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use functional components with hooks
- Prop validation with PropTypes or TypeScript

```javascript
import React, { useState, useEffect } from 'react'

function DeploymentCard({ deployment }) {
  const [status, setStatus] = useState('pending')
  
  useEffect(() => {
    fetchStatus()
  }, [deployment.id])
  
  return (
    <div className="card">
      {/* Component content */}
    </div>
  )
}

export default DeploymentCard
```

### Ansible

- Use YAML format with 2-space indentation
- Include task names
- Use variables for configurable values
- Add comments for complex tasks

### Terraform

- Use consistent naming conventions
- Add descriptions to variables
- Include outputs for important values
- Use modules for reusable components

## Testing

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Integration Tests

```bash
docker-compose up -d
./scripts/run-integration-tests.sh
```

## Pull Request Process

1. **Update Documentation**: Ensure README and other docs reflect your changes
2. **Add Tests**: Include tests for new features
3. **Follow Standards**: Adhere to coding standards
4. **Clean Commits**: Use clear, descriptive commit messages
5. **Update Changelog**: Add entry to CHANGELOG.md

### Commit Message Format

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

Example:
```
feat(api): add POI batch delete endpoint

Add new endpoint to delete multiple POIs at once.
Includes validation and error handling.

Closes #123
```

## Feature Requests

1. Check existing issues for duplicates
2. Open a new issue with "Feature Request" label
3. Provide clear description and use cases
4. Discuss with maintainers before implementing

## Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Python/Node version, etc.)

## Security Issues

**Do not** open public issues for security vulnerabilities.

Email security@otg-tak.example.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Areas for Contribution

### High Priority

- Additional TAK server configurations
- More comprehensive tests
- Performance optimizations
- Documentation improvements

### Features

- Additional cloud providers (Azure, GCP)
- Advanced route planning algorithms
- Enhanced security features
- Mobile app for dashboard

### Documentation

- Tutorial videos
- More examples
- Translations
- Architecture diagrams

## Development Workflow

1. **Issue Assignment**: Comment on issue to request assignment
2. **Branch Creation**: Create feature branch from `main`
3. **Development**: Make changes with regular commits
4. **Testing**: Ensure all tests pass
5. **Documentation**: Update relevant docs
6. **Pull Request**: Submit PR with clear description
7. **Code Review**: Address reviewer feedback
8. **Merge**: Maintainer merges after approval

## Questions?

- Open a discussion on GitHub
- Join our community chat
- Email: dev@otg-tak.example.com

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Recognition

Contributors will be listed in:
- README.md Contributors section
- CHANGELOG.md for specific contributions
- Release notes

Thank you for contributing to OTG-TAK!
