import 'package:json_annotation/json_annotation.dart';

part 'source_entry.g.dart';

/// Source Entry
@JsonSerializable(includeIfNull: false)
class LocalitySourceEntry {
  const LocalitySourceEntry({
    required this.artifactCount,
    required this.citationCount,
    required this.code,
    required this.name,
    this.publisherName,
    required this.sourceId,
  });
  final int artifactCount;
  final int citationCount;
  final String code;
  final String name;
  final String? publisherName;
  final String sourceId;

  factory LocalitySourceEntry.fromJson(Map<String, dynamic> json) => _$LocalitySourceEntryFromJson(json);

  Map<String, dynamic> toJson() => _$LocalitySourceEntryToJson(this);
}
