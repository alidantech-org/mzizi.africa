import 'package:json_annotation/json_annotation.dart';

part 'copy_entry.g.dart';

/// Copy Entry
@JsonSerializable(includeIfNull: false)
class ExperienceCopyEntry {
  const ExperienceCopyEntry({required this.key, required this.text});
  final String key;
  final String text;

  factory ExperienceCopyEntry.fromJson(Map<String, dynamic> json) => _$ExperienceCopyEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceCopyEntryToJson(this);
}
