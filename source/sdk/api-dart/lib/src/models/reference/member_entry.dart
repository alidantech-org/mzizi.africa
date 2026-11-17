import 'package:json_annotation/json_annotation.dart';

part 'member_entry.g.dart';

/// Member Entry
@JsonSerializable(includeIfNull: false)
class ReferenceMemberEntry {
  const ReferenceMemberEntry({required this.code, required this.id, required this.label, this.supersedesId});
  final String code;
  final String id;
  final String label;
  final String? supersedesId;

  factory ReferenceMemberEntry.fromJson(Map<String, dynamic> json) => _$ReferenceMemberEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceMemberEntryToJson(this);
}
