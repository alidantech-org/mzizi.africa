import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/vocabulary/label_kind.dart';

part 'scheme_detail_labels.g.dart';

/// Scheme Detail Labels
@JsonSerializable(includeIfNull: false)
class VocabularySchemeDetailLabels {
  const VocabularySchemeDetailLabels({required this.kind, required this.languageCode, required this.text});
  final VocabularyLabelKind kind;
  final String languageCode;
  final String text;

  factory VocabularySchemeDetailLabels.fromJson(Map<String, dynamic> json) => _$VocabularySchemeDetailLabelsFromJson(json);

  Map<String, dynamic> toJson() => _$VocabularySchemeDetailLabelsToJson(this);
}
