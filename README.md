# QuickQReate - QR Code Generator

QuickQReate is a modern, user-friendly QR code generator web application. It allows users to quickly create customizable QR codes for various purposes, such as sharing URLs, contact information, or any text-based data.

## Features

- **Easy-to-use interface**: Simple and intuitive design for generating QR codes.
- **Real-time preview**: See your QR code update as you make changes.
- **Customization options**:
  - Choose foreground and background colors
  - Adjust QR code size
  - Select error correction level
- **Download functionality**: Save your generated QR code as a PNG file.
- **Responsive design**: Works seamlessly on desktop and mobile devices.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for building the web application
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [qrcode.react](https://www.npmjs.com/package/qrcode.react) - React component to generate QR codes

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm (comes with Node.js) or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/quickqreate.git
   cd quickqreate
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter the URL or text you want to encode in the input field.
2. Customize the QR code appearance using the provided options:
   - Select foreground and background colors
   - Adjust the size using the slider
   - Choose the error correction level
3. The QR code preview will update in real-time as you make changes.
4. Click the "Download QR Code" button to save the generated QR code as a PNG file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request