import 'package:json_annotation/json_annotation.dart';
import 'coded_entity.dart';
import 'value.dart';

part 'country.g.dart';

/// Canonical identity for a modern country; not a geographic unit or historical polity.
@JsonSerializable(includeIfNull: false)
class Country {
  const Country({
    this.callingCode,
    required this.code,
    this.continentId,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    this.designationId,
    this.establishedOn,
    required this.id,
    this.isoAlpha2,
    this.isoAlpha3,
    this.isoNumeric,
    required this.name,
    this.officialName,
    this.recognitionStatusId,
    this.subregionId,
    required this.updatedAt,
    required this.version,
  });
  final String? callingCode;
  final String code;
  final String? continentId;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final String? designationId;
  final DateTime? establishedOn;
  final String id;
  final String? isoAlpha2;
  final String? isoAlpha3;
  final String? isoNumeric;
  final String name;
  final String? officialName;
  final String? recognitionStatusId;
  final String? subregionId;
  final DateTime updatedAt;
  final int version;

  factory Country.fromJson(Map<String, dynamic> json) => _$CountryFromJson(json);

  Map<String, dynamic> toJson() => _$CountryToJson(this);
}