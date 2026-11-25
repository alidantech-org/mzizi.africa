import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/vocabulary/scheme_answers.dart';
import 'package:mzizi_api/src/enums/vocabulary/scheme_shape.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'schemes.g.dart';

/// A controlled list such as feature kind, institution arm, topic, sex or age group. Its words are `vocabulary.labels`; it holds no display text.
@JsonSerializable(includeIfNull: false)
class VocabularySchemes {
  const VocabularySchemes({
    required this.answers,
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.isDated,
    required this.isOpen,
    required this.shape,
    this.stewardId,
    required this.updatedAt,
    required this.version,
  });
  final VocabularySchemeAnswers answers;
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final bool isDated;
  final bool isOpen;
  final VocabularySchemeShape shape;
  final String? stewardId;
  final DateTime updatedAt;
  final int version;

  factory VocabularySchemes.fromJson(Map<String, dynamic> json) => _$VocabularySchemesFromJson(json);

  Map<String, dynamic> toJson() => _$VocabularySchemesToJson(this);
}
