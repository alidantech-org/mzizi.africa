import 'package:json_annotation/json_annotation.dart';

part 'scheme_entry.g.dart';

/// Scheme Entry
@JsonSerializable(includeIfNull: false)
class ReferenceSchemeEntry {
  const ReferenceSchemeEntry({required this.code, required this.id, required this.title});
  final String code;
  final String id;
  final String title;

  factory ReferenceSchemeEntry.fromJson(Map<String, dynamic> json) => _$ReferenceSchemeEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceSchemeEntryToJson(this);
}
