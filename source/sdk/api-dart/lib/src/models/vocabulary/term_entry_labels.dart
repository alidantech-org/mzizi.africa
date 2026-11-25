import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/vocabulary/label_kind.dart';

part 'term_entry_labels.g.dart';

/// Term Entry Labels
@JsonSerializable(includeIfNull: false)
class VocabularyTermEntryLabels {
  const VocabularyTermEntryLabels({this.countryId, required this.kind, required this.languageCode, required this.text});
  final String? countryId;
  final VocabularyLabelKind kind;
  final String languageCode;
  final String text;

  factory VocabularyTermEntryLabels.fromJson(Map<String, dynamic> json) => _$VocabularyTermEntryLabelsFromJson(json);

  Map<String, dynamic> toJson() => _$VocabularyTermEntryLabelsToJson(this);
}
