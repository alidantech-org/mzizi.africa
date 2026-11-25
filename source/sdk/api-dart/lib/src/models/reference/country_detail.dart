import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/country_detail_locales.dart';
import 'package:mzizi_api/src/models/reference/country_detail_names.dart';

part 'country_detail.g.dart';

/// Country Detail
@JsonSerializable(includeIfNull: false)
class ReferenceCountryDetail {
  const ReferenceCountryDetail({
    this.callingCode,
    required this.code,
    required this.countryId,
    this.currencyId,
    this.designationTerm,
    this.establishedOn,
    this.isoAlpha2,
    this.isoAlpha3,
    this.isoNumeric,
    required this.locales,
    required this.names,
    this.recognitionTerm,
  });
  final String? callingCode;
  final String code;
  final String countryId;
  final String? currencyId;
  final String? designationTerm;
  final DateTime? establishedOn;
  final String? isoAlpha2;
  final String? isoAlpha3;
  final String? isoNumeric;
  final List<ReferenceCountryDetailLocales> locales;
  final List<ReferenceCountryDetailNames> names;
  final String? recognitionTerm;

  factory ReferenceCountryDetail.fromJson(Map<String, dynamic> json) => _$ReferenceCountryDetailFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCountryDetailToJson(this);
}
