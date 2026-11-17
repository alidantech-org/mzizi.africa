import 'package:flutter/material.dart';
import 'package:internet_connection_checker_plus/internet_connection_checker_plus.dart';

/// Shows [child] while the device is online, and a reconnect message while it isn't.
class AppNetworkRequiredGate extends StatelessWidget {
  const AppNetworkRequiredGate({
    super.key,
    required this.title,
    required this.child,
    this.message = 'This screen needs an internet connection. Reconnect to continue.',
  });

  final String title;
  final String message;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<InternetStatus>(
      stream: InternetConnection().onStatusChange,
      initialData: InternetStatus.connected,
      builder: (context, snapshot) {
        if (snapshot.data != InternetStatus.disconnected) return child;
        return Scaffold(
          appBar: AppBar(title: Text(title)),
          body: Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Text(message, textAlign: TextAlign.center),
            ),
          ),
        );
      },
    );
  }
}
