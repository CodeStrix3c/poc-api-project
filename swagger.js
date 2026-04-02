import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Discussion Forum API',
      version: '1.0.0',
      description: 'Stack Overflow-like REST API with SQLite database',
    },
    servers: [{ url: 'http://localhost:3001', description: 'Development server' }],
    components: {
      schemas: {
        Question: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            body: { type: 'string' },
            userId: { type: 'integer' },
            votes: { type: 'integer' },
            views: { type: 'integer' },
            answersCount: { type: 'integer' },
            acceptedAnswerId: { type: 'integer' },
            status: { type: 'string', enum: ['open', 'answered', 'closed'] },
            isBounty: { type: 'boolean' },
            bountyAmount: { type: 'integer' },
            tags: { type: 'array', items: { type: 'string' } },
            media: { type: 'array' },
            comments: { type: 'array' },
          },
        },
        Answer: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            questionId: { type: 'integer' },
            userId: { type: 'integer' },
            body: { type: 'string' },
            votes: { type: 'integer' },
            isAccepted: { type: 'boolean' },
            media: { type: 'array' },
            comments: { type: 'array' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            questionId: { type: 'integer' },
            answerId: { type: 'integer' },
            body: { type: 'string' },
            votes: { type: 'integer' },
          },
        },
      },
    },
    paths: {
      '/api/v1/questions': {
        get: {
          tags: ['Questions'],
          summary: 'List all questions',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 15 } },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['votes', 'views', 'created', 'activity', 'answers'] } },
            { name: 'tag', in: 'query', schema: { type: 'string' } },
            { name: 'q', in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'List of questions' } },
        },
        post: {
          tags: ['Questions'],
          summary: 'Create a question',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'body', 'userId'],
                  properties: {
                    title: { type: 'string', description: 'Question title' },
                    body: { type: 'string', description: 'Question details/description' },
                    userId: { type: 'integer', description: 'ID of user asking the question' },
                    tags: { type: 'array', items: { type: 'string' }, description: 'Array of tag names' },
                    isBounty: { type: 'boolean', default: false, description: 'Whether question has a bounty' },
                    bountyAmount: { type: 'integer', default: 0, description: 'Bounty amount in points' },
                  },
                },
                example: {
                  title: 'How to handle file uploads in FastAPI with S3?',
                  body: 'I need to upload files to S3 from my FastAPI server...',
                  userId: 1,
                  tags: ['fastapi', 's3', 'python'],
                  isBounty: true,
                  bountyAmount: 100,
                },
              },
            },
          },
          responses: { 201: { description: 'Question created' } },
        },
      },
      '/api/v1/questions/{id}': {
        get: {
          tags: ['Questions'],
          summary: 'Get question by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Question details' }, 404: { description: 'Not found' } },
        },
        put: {
          tags: ['Questions'],
          summary: 'Update question',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', description: 'Updated title' },
                    body: { type: 'string', description: 'Updated body/description' },
                    status: { type: 'string', enum: ['open', 'answered', 'closed'] },
                  },
                },
                example: {
                  title: 'Updated question title',
                  body: 'Updated question body',
                  status: 'answered',
                },
              },
            },
          },
          responses: { 200: { description: 'Question updated' } },
        },
        delete: {
          tags: ['Questions'],
          summary: 'Delete question',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 204: { description: 'Deleted' } },
        },
      },
      '/api/v1/questions/{id}/answers': {
        get: {
          tags: ['Answers'],
          summary: 'Get answers for a question',
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['votes', 'created'] } },
            { name: 'order', in: 'query', schema: { type: 'string', enum: ['DESC', 'ASC'] } },
          ],
          responses: { 200: { description: 'List of answers' } },
        },
        post: {
          tags: ['Answers'],
          summary: 'Create an answer for a question',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['body', 'userId'],
                  properties: {
                    body: { type: 'string', description: 'Answer content' },
                    userId: { type: 'integer', description: 'ID of user providing the answer' },
                  },
                },
                example: {
                  body: 'You can use boto3 with `multipart_threshold` to handle large files efficiently...',
                  userId: 2,
                },
              },
            },
          },
          responses: { 201: { description: 'Answer created' } },
        },
      },
      '/api/v1/answers/{id}/accept': {
        patch: {
          tags: ['Answers'],
          summary: 'Accept an answer as correct',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Answer accepted' } },
        },
      },
      '/api/v1/comments': {
        post: {
          tags: ['Comments'],
          summary: 'Create a comment on a question or answer',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['userId', 'body'],
                  properties: {
                    userId: { type: 'integer', description: 'ID of user posting the comment' },
                    questionId: { type: 'integer', description: 'ID of question (required if no answerId)' },
                    answerId: { type: 'integer', description: 'ID of answer (required if no questionId)' },
                    body: { type: 'string', description: 'Comment text' },
                  },
                },
                example: {
                  userId: 3,
                  answerId: 1,
                  body: 'Great explanation! Have you considered handling errors with retries?',
                },
              },
            },
          },
          responses: { 201: { description: 'Comment created' } },
        },
      },
      '/api/v1/votes': {
        post: {
          tags: ['Votes'],
          summary: 'Cast a vote (upvote/downvote)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['userId', 'targetType', 'targetId', 'value'],
                  properties: {
                    userId: { type: 'integer', description: 'ID of user voting' },
                    targetType: { type: 'string', enum: ['question', 'answer', 'comment'], description: 'Type of target being voted on' },
                    targetId: { type: 'integer', description: 'ID of the target (question/answer/comment)' },
                    value: { type: 'integer', enum: [1, -1], description: '1 for upvote, -1 for downvote' },
                  },
                },
                example: {
                  userId: 1,
                  targetType: 'answer',
                  targetId: 5,
                  value: 1,
                },
              },
            },
          },
          responses: { 200: { description: 'Vote registered' } },
        },
      },
      '/api/v1/users': {
        get: {
          tags: ['Users'],
          summary: 'List all users',
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 15 } },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['reputation', 'joined', 'name'] } },
          ],
          responses: { 200: { description: 'List of users' } },
        },
      },
      '/api/v1/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'User details' }, 404: { description: 'Not found' } },
        },
      },
      '/api/v1/tags': {
        get: {
          tags: ['Tags'],
          summary: 'List all tags',
          parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }],
          responses: { 200: { description: 'List of tags' } },
        },
      },
      '/api/v1/notifications/{userId}': {
        get: {
          tags: ['Notifications'],
          summary: 'Get notifications for a user',
          parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'List of notifications' } },
        },
      },
      '/api/v1/notifications/{id}/read': {
        patch: {
          tags: ['Notifications'],
          summary: 'Mark notification as read',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Notification marked as read' } },
        },
      },
      '/api/v1/bookmarks/{userId}': {
        get: {
          tags: ['Bookmarks'],
          summary: 'Get user bookmarks',
          parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'List of bookmarked questions' } },
        },
      },
      '/api/v1/bookmarks': {
        post: {
          tags: ['Bookmarks'],
          summary: 'Add a bookmark',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['userId', 'questionId'],
                  properties: {
                    userId: { type: 'integer', description: 'ID of user bookmarking' },
                    questionId: { type: 'integer', description: 'ID of question to bookmark' },
                  },
                },
                example: {
                  userId: 1,
                  questionId: 5,
                },
              },
            },
          },
          responses: { 201: { description: 'Bookmark added' }, 409: { description: 'Already bookmarked' } },
        },
      },
      '/api/v1/bookmarks/{userId}/{questionId}': {
        delete: {
          tags: ['Bookmarks'],
          summary: 'Remove a bookmark',
          parameters: [
            { name: 'userId', in: 'path', required: true, schema: { type: 'integer' } },
            { name: 'questionId', in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: { 204: { description: 'Bookmark removed' } },
        },
      },
      '/api/v1/media': {
        post: {
          tags: ['Media'],
          summary: 'Upload media (image/video) for a question or answer',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['type', 'url'],
                  properties: {
                    questionId: { type: 'integer', description: 'ID of question (required if no answerId)' },
                    answerId: { type: 'integer', description: 'ID of answer (required if no questionId)' },
                    type: { type: 'string', enum: ['image', 'video', 'embed'], description: 'Type of media' },
                    url: { type: 'string', description: 'Direct URL to media file' },
                    thumbnail: { type: 'string', description: 'URL to thumbnail image' },
                    altText: { type: 'string', description: 'Alternative text for accessibility' },
                    width: { type: 'integer', description: 'Media width in pixels' },
                    height: { type: 'integer', description: 'Media height in pixels' },
                    duration: { type: 'number', description: 'Duration in seconds (for videos)' },
                    platform: { type: 'string', description: 'Platform source (e.g., youtube, imgur)' },
                  },
                },
                example: {
                  answerId: 1,
                  type: 'image',
                  url: 'https://example.com/screenshot.png',
                  altText: 'FastAPI async file upload screenshot',
                  width: 800,
                  height: 600,
                },
              },
            },
          },
          responses: { 201: { description: 'Media uploaded' } },
        },
      },
      '/api/v1/search': {
        get: {
          tags: ['Search'],
          summary: 'Search questions',
          parameters: [
            { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search query' },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 15 } },
          ],
          responses: { 200: { description: 'Search results' } },
        },
      },
      '/api/v1/stats': {
        get: {
          tags: ['Health'],
          summary: 'Get API statistics',
          responses: { 200: { description: 'API statistics' } },
        },
      },
      '/api/v1/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          responses: { 200: { description: 'API is healthy' } },
        },
      },
    },
  },
  apis: [],
};

export const specs = swaggerJsdoc(options);
