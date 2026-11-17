import 'package:go_router/go_router.dart';
import 'package:material_ui/material_ui.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/routers/navigation.dart';

/// A name search that opens the places screen.
class PlaceSearchBox extends ConsumerStatefulWidget {
  const PlaceSearchBox({super.key, this.initial = ''});

  final String initial;

  @override
  ConsumerState<PlaceSearchBox> createState() => _PlaceSearchBoxState();
}

class _PlaceSearchBoxState extends ConsumerState<PlaceSearchBox> {
  late final TextEditingController _controller = TextEditingController(
    text: widget.initial,
  );

  void _submit() {
    final text = _controller.text.trim();
    if (text.length >= 2)
      context.go(
        '${AppRoutes.placeSearch}?q=${Uri.encodeQueryComponent(text)}',
      );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final language = ref.watch(languageProvider);
    return TextField(
      controller: _controller,
      textInputAction: TextInputAction.search,
      onSubmitted: (_) => _submit(),
      decoration: InputDecoration(
        hintText: tr(language, 'searchHint'),
        prefixIcon: const Icon(Icons.search),
        suffixIcon: IconButton(
          icon: const Icon(Icons.arrow_forward),
          onPressed: _submit,
        ),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(32)),
        filled: true,
      ),
    );
  }
}
