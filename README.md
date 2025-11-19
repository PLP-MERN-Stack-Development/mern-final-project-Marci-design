# TransitFlow

TransitFlow is a smart mobility app built to modernize and bring predictability to Africa's informal public transport systems — such as Matatus, Tro-Tros, and Danfo buses. It focuses on the daily commuter, offering real-time vehicle tracking, digital ticketing, and route optimization to reduce waiting times, eliminate cash hassles, and increase transparency.

## Table of contents

- [Key features](#key-features)
- [How it works](#how-it-works)
- [Target users](#target-users)
- [Technology stack (assumed)](#technology-stack-assumed)
- [Getting started](#getting-started)
- [Contributing](#contributing)
- [Support](#support)
- [License & credits](#license--credits)

## Key features

- Real-time informal transit tracking
	- Drivers or community contributors provide live location updates for vehicles on fixed informal routes so commuters can see where their ride is and when it will arrive.

- Digital ticketing & payments
	- Cashless payments via mobile money (M-Pesa, MTN MoMo, etc.) or in-app wallet.
	- Cash top-up options: users can load wallets through accredited TransitFlow Agents (kiosks / mobile-money dealers) or receive an on-board digital ticket when paying cash to drivers/conductors.
	- Fare transparency with upfront, fixed pricing.

- Route optimization & directions
	- Smart routing that combines walking, formal transport, and informal transit to provide the fastest and most cost-effective routes.
	- Destination discovery to find stops, stages, and final destinations easily.

- Safety & reliability
	- Community-driven driver and vehicle ratings and reviews.
	- Trip history and digital receipts for passenger reference.

## How it works

1. Drivers install the driver/vehicle app or the community provides vehicle location updates.
2. Vehicles broadcast real-time location data to the backend.
3. Riders view live locations, purchase tickets, and plan routes in the user app.
4. Payments are processed via integrated mobile money or on-board issuance when users pay cash.

## Target users

- Daily commuters who rely on informal public transport.
- Tourists and new residents who need guidance navigating non-digital transport systems.
- Transport operators and planners who want data on route performance, peak times, and revenue.

## Technology stack 

- Frontend: Expo
- Backend: Node.js (REST API)
- Database: Mongodb
- Mapping: Open Street Maps

## Contributing

We welcome contributions of code, documentation, and transport data. Typical ways to help:

- Add or verify route & stage data for your city.
- Improve the app UI/UX or add accessibility features.
- Implement integrations with local mobile money providers.

Please read `CONTRIBUTING.md` for developer setup, testing, and pull request guidelines before opening an issue or pull request.

## Support

For bug reports, feature requests, or support inquiries, contact: support@transitflow.com or open an issue in this repository.

## License & credits

Built with love for  cities.

This project is licensed under the MIT License — see the `LICENSE` file for details. Replace the copyright holder in `LICENSE` with the correct name.
