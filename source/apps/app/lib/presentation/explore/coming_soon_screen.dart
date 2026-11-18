import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/brand/mz_icon.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';

/// A screen whose data the app does not serve yet. It says so instead of showing nothing.
class ComingSoonScreen extends StatelessWidget {
  const ComingSoonScreen({super.key, required this.title});
  final String title;
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      leading: IconButton(
        icon: MzIcon('chevron-left'),
        onPressed: () =>
            context.canPop() ? context.pop() : context.go('/explore'),
      ),
      title: Text(t(context, title)),
    ),
    body: Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Tx(
          'This part is not available in the app yet.',
          textAlign: TextAlign.center,
        ),
      ),
    ),
  );
}
