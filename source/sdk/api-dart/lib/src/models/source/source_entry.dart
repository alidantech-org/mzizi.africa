import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/source/source_kind.dart';
import 'package:mzizi_api/src/models/source/source_entry_publisher_names.dart';

part 'source_entry.g.dart';

/// Source Entry
@JsonSerializable(includeIfNull: false)
class SourceSourceEntry {
  const SourceSourceEntry({
    required this.code,
    this.credibilityTerm,
    required this.kind,
    required this.label,
    required this.publisherCode,
    required this.publisherId,
    required this.publisherNames,
    required this.sourceId,
  });
  final String code;
  final String? credibilityTerm;
  final SourceSourceKind kind;
  final String label;
  final String publisherCode;
  final String publisherId;
  final List<SourceSourceEntryPublisherNames> publisherNames;
  final String sourceId;

  factory SourceSourceEntry.fromJson(Map<String, dynamic> json) => _$SourceSourceEntryFromJson(json);

  Map<String, dynamic> toJson() => _$SourceSourceEntryToJson(this);
}
