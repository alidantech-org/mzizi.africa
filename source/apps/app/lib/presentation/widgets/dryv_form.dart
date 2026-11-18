import 'package:material_ui/material_ui.dart';
import 'package:flutter_api_bridge/flutter_api_bridge.dart';

/// How a generated form edits one schema field.
enum DryvFieldKind { text, number, boolean, date, choice }

/// One form field, generated from a schema field.
class DryvField {
  const DryvField({
    required this.name,
    required this.label,
    required this.kind,
    this.required = false,
    this.options = const <String>[],
  });

  /// The JSON key the API expects.
  final String name;
  final String label;
  final DryvFieldKind kind;
  final bool required;

  /// The allowed values of a [DryvFieldKind.choice] field.
  final List<String> options;
}

/// A form built from [fields]; submitting sends the collected JSON values to [onSubmit].
class DryvForm extends StatefulWidget {
  const DryvForm({
    super.key,
    required this.fields,
    required this.onSubmit,
    this.submitLabel = 'Submit',
  });

  final List<DryvField> fields;
  final Future<ApiResult<Object?>> Function(Map<String, Object?> values)
  onSubmit;
  final String submitLabel;

  @override
  State<DryvForm> createState() => _DryvFormState();
}

class _DryvFormState extends State<DryvForm> {
  final _formKey = GlobalKey<FormState>();
  final Map<String, Object?> _values = <String, Object?>{};
  bool _submitting = false;
  String? _message;

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    _formKey.currentState?.save();
    setState(() {
      _submitting = true;
      _message = null;
    });
    final result = await widget.onSubmit(Map<String, Object?>.of(_values));
    if (!mounted) return;
    setState(() {
      _submitting = false;
      _message = result.isError ? result.message : null;
    });
  }

  String? _requiredText(DryvField field, String? value) {
    if (field.required && (value == null || value.trim().isEmpty)) {
      return '${field.label} is required';
    }
    return null;
  }

  Widget _field(DryvField field) {
    switch (field.kind) {
      case DryvFieldKind.boolean:
        return FormField<bool>(
          initialValue: false,
          onSaved: (value) => _values[field.name] = value ?? false,
          builder: (state) => SwitchListTile(
            title: Text(field.label),
            value: state.value ?? false,
            onChanged: state.didChange,
          ),
        );
      case DryvFieldKind.choice:
        return DropdownButtonFormField<String>(
          decoration: InputDecoration(labelText: field.label),
          items: [
            for (final option in field.options)
              DropdownMenuItem(value: option, child: Text(option)),
          ],
          validator: (value) => field.required && value == null
              ? '${field.label} is required'
              : null,
          onChanged: (_) {},
          onSaved: (value) => _values[field.name] = value,
        );
      case DryvFieldKind.number:
        return TextFormField(
          decoration: InputDecoration(labelText: field.label),
          keyboardType: TextInputType.number,
          validator: (value) =>
              _requiredText(field, value) ??
              (value != null && value.isNotEmpty && num.tryParse(value) == null
                  ? 'Enter a number'
                  : null),
          onSaved: (value) => _values[field.name] =
              value == null || value.isEmpty ? null : num.parse(value),
        );
      case DryvFieldKind.date:
      case DryvFieldKind.text:
        return TextFormField(
          decoration: InputDecoration(
            labelText: field.label,
            hintText: field.kind == DryvFieldKind.date ? 'YYYY-MM-DD' : null,
          ),
          validator: (value) => _requiredText(field, value),
          onSaved: (value) => _values[field.name] =
              value == null || value.isEmpty ? null : value,
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (final field in widget.fields) _field(field),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: _submitting ? null : _submit,
            child: _submitting
                ? const SizedBox.square(
                    dimension: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Text(widget.submitLabel),
          ),
          if (_message != null)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(
                _message!,
                style: TextStyle(color: Theme.of(context).colorScheme.error),
              ),
            ),
        ],
      ),
    );
  }
}
