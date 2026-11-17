import 'package:json_annotation/json_annotation.dart';

part 'scheme_entry.g.dart';

/// Scheme Entry
@JsonSerializable(includeIfNull: false)
class SchemeEntry {
  const SchemeEntry({
    required this.code,
    required this.id,
    required this.title,
  });
  final String code;
  final String id;
  final String title;

  factory SchemeEntry.fromJson(Map<String, dynamic> json) => _$SchemeEntryFromJson(json);

  Map<String, dynamic> toJson() => _$SchemeEntryToJson(this);
}