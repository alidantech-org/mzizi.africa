import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/economy/name_kind.dart';
import 'package:mzizi_api/src/models/economy/goods.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'names.g.dart';

/// Names of a good in any language.
@JsonSerializable(includeIfNull: false)
class EconomyNames {
  const EconomyNames({
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.goodId,
    required this.id,
    required this.kind,
    required this.languageId,
    required this.text,
    required this.updatedAt,
    required this.version,
  });
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String goodId;
  final String id;
  final EconomyNameKind kind;
  final String languageId;
  final String text;
  final DateTime updatedAt;
  final int version;

  factory EconomyNames.fromJson(Map<String, dynamic> json) => _$EconomyNamesFromJson(json);

  Map<String, dynamic> toJson() => _$EconomyNamesToJson(this);
}
