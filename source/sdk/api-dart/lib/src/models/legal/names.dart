import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legal/instruments.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'names.g.dart';

/// A name of one instrument in one language, with its kind and validity. All forms resolve to the same instrument.
@JsonSerializable(includeIfNull: false)
class LegalNames {
  const LegalNames({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.instrumentId,
    required this.isPreferred,
    required this.kindId,
    required this.languageId,
    required this.name,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String instrumentId;
  final bool isPreferred;
  final String kindId;
  final String languageId;
  final String name;
  final DateTime updatedAt;
  final int version;

  factory LegalNames.fromJson(Map<String, dynamic> json) => _$LegalNamesFromJson(json);

  Map<String, dynamic> toJson() => _$LegalNamesToJson(this);
}
