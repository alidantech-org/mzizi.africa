import 'package:json_annotation/json_annotation.dart';

part 'context_country.g.dart';

/// Context Country
@JsonSerializable(includeIfNull: false)
class ExperienceContextCountry {
  const ExperienceContextCountry({
    required this.code,
    this.currencyCode,
    this.defaultLanguageCode,
    required this.isServed,
    this.isoCode,
    required this.name,
    this.subdomain,
  });
  final String code;
  final String? currencyCode;
  final String? defaultLanguageCode;
  final bool isServed;
  final String? isoCode;
  final String name;
  final String? subdomain;

  factory ExperienceContextCountry.fromJson(Map<String, dynamic> json) => _$ExperienceContextCountryFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceContextCountryToJson(this);
}
