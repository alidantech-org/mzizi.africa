import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/source/evidence_entry.dart';

part 'evidence_collection.g.dart';

/// Evidence Collection
@JsonSerializable(includeIfNull: false)
class SourceEvidenceCollection {
  const SourceEvidenceCollection({required this.evidence});
  final List<SourceEvidenceEntry> evidence;

  factory SourceEvidenceCollection.fromJson(Map<String, dynamic> json) => _$SourceEvidenceCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$SourceEvidenceCollectionToJson(this);
}
