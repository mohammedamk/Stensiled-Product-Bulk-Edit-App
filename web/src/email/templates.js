const templates =  {
    basic: (mailOptions) => ({
        subject:`Shopify: Bulk Edit App Customer Query`,
        html:`<body>
        <div>Name : ${mailOptions.name}</div>
        <div>Email : ${mailOptions.email}</div>
        <div>Query : ${mailOptions.message}</div>
        </body>`,
        text:''
    })
}

export default templates;