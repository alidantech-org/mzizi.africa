import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/vocabulary/scheme_answers.dart';
import 'package:mzizi_api/src/enums/vocabulary/scheme_shape.dart';
import 'package:mzizi_api/src/models/vocabulary/scheme_detail_labels.dart';

part 'scheme_detail.g.dart';

/// Scheme Detail
@JsonSerializable(includeIfNull: false)
class VocabularySchemeDetail {
  const VocabularySchemeDetail({
    required this.answers,
    required this.code,
    required this.isOpen,
    required this.labels,
    required this.schemeId,
    required this.shape,
  });
  final VocabularySchemeAnswers answers;
  final String code;
  final bool isOpen;
  final List<VocabularySchemeDetailLabels> labels;
  final String schemeId;
  final VocabularySchemeShape shape;

  factory VocabularySchemeDetail.fromJson(Map<String, dynamic> json) => _$VocabularySchemeDetailFromJson(json);

  Map<String, dynamic> toJson() => _$VocabularySchemeDetailToJson(this);
}
