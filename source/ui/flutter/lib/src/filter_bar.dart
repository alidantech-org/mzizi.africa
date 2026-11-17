/// A column of filter fields with an apply button. It holds the draft values and hands them over on submit.
library;

import 'package:material_ui/material_ui.dart';
import 'package:mzizi_ui/src/types.dart';

class MziziFilterBar extends StatefulWidget {
  const MziziFilterBar({
    super.key,
    required this.fields,
    required this.initial,
    required this.submitLabel,
    required this.onSubmit,
  });

  final List<FieldSpec> fields;
  final Map<String, String> initial;
  final String submitLabel;
  final void Function(Map<String, String> values) onSubmit;

  @override
  State<MziziFilterBar> createState() => _MziziFilterBarState();
}

class _MziziFilterBarState extends State<MziziFilterBar> {
  late final Map<String, TextEditingController> _controllers = {
    for (final field in widget.fields)
      field.name: TextEditingController(text: widget.initial[field.name] ?? ''),
  };

  @override
  void dispose() {
    for (final controller in _controllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  void _submit() {
    widget.onSubmit({
      for (final entry in _controllers.entries) entry.key: entry.value.text,
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        for (final field in widget.fields) ...[
          TextField(
            controller: _controllers[field.name],
            decoration: InputDecoration(labelText: field.label),
            onSubmitted: (_) => _submit(),
          ),
          const SizedBox(height: 12),
        ],
        FilledButton(onPressed: _submit, child: Text(widget.submitLabel)),
      ],
    );
  }
}
