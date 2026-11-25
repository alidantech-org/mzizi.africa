import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/vocabulary/term_status.dart';
import 'package:mzizi_api/src/models/vocabulary/term_entry_labels.dart';

part 'term_entry.g.dart';

/// Term Entry
@JsonSerializable(includeIfNull: false)
class VocabularyTermEntry {
  const VocabularyTermEntry({
    required this.code,
    this.colorToken,
    this.iconCode,
    required this.labels,
    this.lower,
    this.parentId,
    this.position,
    required this.status,
    required this.termId,
    this.upper,
  });
  final String code;
  final String? colorToken;
  final String? iconCode;
  final List<VocabularyTermEntryLabels> labels;
  final double? lower;
  final String? parentId;
  final int? position;
  final VocabularyTermStatus status;
  final String termId;
  final double? upper;

  factory VocabularyTermEntry.fromJson(Map<String, dynamic> json) => _$VocabularyTermEntryFromJson(json);

  Map<String, dynamic> toJson() => _$VocabularyTermEntryToJson(this);
}
