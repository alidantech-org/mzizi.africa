import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'country_tenders.g.dart';

/// Country Tenders
@JsonSerializable(includeIfNull: false)
class CivicCountryTenders {
  const CivicCountryTenders({required this.countryId, this.limit, this.offset, this.statusTerm});
  final String countryId;
  final int? limit;
  final int? offset;
  final String? statusTerm;

  factory CivicCountryTenders.fromJson(Map<String, dynamic> json) => _$CivicCountryTendersFromJson(json);

  Map<String, dynamic> toJson() => _$CivicCountryTendersToJson(this);
}
