import 'package:json_annotation/json_annotation.dart';

part 'copy_entry.g.dart';

/// Copy Entry
@JsonSerializable(includeIfNull: false)
class ExplorerCopyEntry {
  const ExplorerCopyEntry({required this.key, required this.text});
  final String key;
  final String text;

  factory ExplorerCopyEntry.fromJson(Map<String, dynamic> json) => _$ExplorerCopyEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ExplorerCopyEntryToJson(this);
}
