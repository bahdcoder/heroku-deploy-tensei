const { cms } = require('@tensei/cms')
const { auth } = require('@tensei/auth')
const { smtp } = require('@tensei/mail')
const { media } = require('@tensei/media')
const { graphql } = require('@tensei/graphql')
const { tensei, welcome, resource, text, textarea, dateTime, slug, hasMany, belongsTo } = require('@tensei/core')

tensei()
    .root(__dirname)
    .mailer('transactions')
    .resources([
        resource('Post')
            .fields([
                text('Title'),
                slug('Slug').from('Title'),
                textarea('Description'),
                textarea('Content'),
                dateTime('Published At'),
                belongsTo('Category')
            ])
            .displayField('Title'),
            resource('Category')
                .fields([
                    text('Name').notNullable().rules('required'),
                    textarea('Description'),
                    hasMany('Post')
                ])
                .displayField('Name')
    ])
    .plugins([
        welcome(),
        cms().plugin(),
        auth().rolesAndPermissions().plugin(),
        media().plugin(),
        graphql().plugin(),
        smtp('transactions')
            .user(process.env.SMTP_USER)
            .pass(process.env.SMTP_PASS)
            .port(process.env.SMTP_PORT)
            .host(process.env.SMTP_HOST)
            .plugin()
    ])
    .start()
    .catch(console.error)
