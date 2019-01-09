const buttons = {
  "type": "template",
  "altText": "This is a buttons template",
  "template": {
      "type": "buttons",
      "thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
      "imageAspectRatio": "rectangle",
      "imageSize": "cover",
      "imageBackgroundColor": "#FFFFFF",
      "title": "Menu",
      "text": "Please select",
      "defaultAction": {
          "type": "uri",
          "label": "View detail",
          "uri": "http://example.com/page/123"
      },
      "actions": [
          {
            "type": "postback",
            "label": "Buy",
            "data": "action=buy&itemid=123"
          },
          {
            "type": "uri",
            "label": "View detail",
            "uri": "http://example.com/page/123"
          },
          {
            "type": "message",
            "label": "not this one",
            "text": "別のにしたい"
          },
      ]
  }
}

const confirm = {
  type: 'template',
  altText: 'Confirm alt text',
  template: {
    type: 'confirm',
    text: 'Do it?',
    actions: [
      { label: 'Yes', type: 'message', text: 'Yes!' },
      { label: 'No', type: 'message', text: 'No!' },
    ],
  },
}

const carousel = {
  type: 'template',
  altText: 'Carousel alt text',
  template: {
    type: 'carousel',
    columns: [
      {
        thumbnailImageUrl: buttonsImageURL,
        title: 'hoge',
        text: 'fuga',
        actions: [
          { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
          { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
        ],
      },
      {
        thumbnailImageUrl: buttonsImageURL,
        title: 'hoge',
        text: 'fuga',
        actions: [
          { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
          { label: 'Say message', type: 'message', text: 'Rice=米' },
        ],
      },
    ],
  },
}

const imageCarousel = {
  type: 'template',
  altText: 'Image carousel alt text',
  template: {
    type: 'image_carousel',
    columns: [
      {
        imageUrl: buttonsImageURL,
        action: { label: 'Go to LINE', type: 'uri', uri: 'https://line.me' },
      },
      {
        imageUrl: buttonsImageURL,
        action: { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
      },
      {
        imageUrl: buttonsImageURL,
        action: { label: 'Say message', type: 'message', text: 'Rice=米' },
      },
      {
        imageUrl: buttonsImageURL,
        action: {
          label: 'datetime',
          type: 'datetimepicker',
          data: 'DATETIME',
          mode: 'datetime',
        },
      },
    ]
  },
}

const datetimePicker = {
  type: 'template',
  altText: 'Datetime pickers alt text',
  template: {
    type: 'buttons',
    text: 'Select date / time !',
    actions: [
      { type: 'datetimepicker', label: 'date', data: 'DATE', mode: 'date' },
      { type: 'datetimepicker', label: 'time', data: 'TIME', mode: 'time' },
      { type: 'datetimepicker', label: 'datetime', data: 'DATETIME', mode: 'datetime' },
    ],
  },
};

module.exports = { buttons, confirm };