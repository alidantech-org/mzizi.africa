import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'copy.g.dart';

/// One interface or explanatory wording for one copy key in one language, optionally specific to a country. Screens declare keys; the words live here.
@JsonSerializable(includeIfNull: false)
class ReferenceCopy {
  const ReferenceCopy({
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.isDevelopmentText,
    required this.key,
    required this.languageId,
    required this.text,
    required this.updatedAt,
    required this.version,
  });
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final bool isDevelopmentText;
  final String key;
  final String languageId;
  final String text;
  final DateTime updatedAt;
  final int version;

  factory ReferenceCopy.fromJson(Map<String, dynamic> json) => _$ReferenceCopyFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCopyToJson(this);
}
