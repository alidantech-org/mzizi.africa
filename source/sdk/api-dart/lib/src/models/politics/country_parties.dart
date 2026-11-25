import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'country_parties.g.dart';

/// Country Parties
@JsonSerializable(includeIfNull: false)
class PoliticsCountryParties {
  const PoliticsCountryParties({required this.countryId, this.limit, this.offset});
  final String countryId;
  final int? limit;
  final int? offset;

  factory PoliticsCountryParties.fromJson(Map<String, dynamic> json) => _$PoliticsCountryPartiesFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsCountryPartiesToJson(this);
}
